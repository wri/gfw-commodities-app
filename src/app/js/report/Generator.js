define([
    "dojo/on",
    "dojo/dom",
    "dojo/query",
    "esri/config",
    "dojo/request/xhr",
    "dojo/Deferred",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/promise/all",
    "dojo/_base/array",
    "dijit/Dialog",
    "dojox/validate/web",
    "esri/geometry/Point",
    "esri/geometry/Polygon",
    "esri/SpatialReference",
    "esri/tasks/GeometryService",
    "esri/geometry/webMercatorUtils",
    // Local Modules from report folder
    "report/config",
    "report/Fetcher"
], function(on, dom, dojoQuery, esriConfig, xhr, Deferred, domClass, domStyle, all, arrayUtils, Dialog, validate, Point, Polygon, SpatialReference, GeometryService, webMercatorUtils, Config, Fetcher) {
    'use strict';

    window.report = {};

    return {

        init: function() {
            // Payload is passed as Global Payload object, grab and make sure its defined before doing anything else
            if (window.payload) {
                this.applyConfigurations();
                this.prepareForAnalysis();
                this.addSubscriptionDialog();
                
                // 20141217 CRB - Added info icon to Total Calculated Area in report header
                this.setupHeader();
            }
        },

        applyConfigurations: function() {
            arrayUtils.forEach(Config.corsEnabledServers, function(server) {
                esriConfig.defaults.io.corsEnabledServers.push(server);
            });
        },

        // 20141217 CRB - Added info icon to Total Calculated Area in report header
        setupHeader: function () {
            var node = dom.byId("total-area-info-icon");
            on(node, 'click', function(evt) {
                //console.log("i button clicked -- setting popup visibility");
                domStyle.set("total-area-info-popup", "visibility", "visible");
            });
            node = dom.byId("total-area-close-info-icon");
            //console.log("adding click event to i button", node);
            on(node, 'click', function(evt) {
                //console.log("i button clicked -- setting popup visibility");
                domStyle.set("total-area-info-popup", "visibility", "hidden");
            });
        },

        prepareForAnalysis: function() {

            var self = this,
                geometryService = new GeometryService(Config.geometryServiceUrl),
                sr = new SpatialReference(102100),
                projectionCallback,
                failure,
                poly;

            // Parse the geometry from the global payload object
            report.geometry = JSON.parse(window.payload.geometry);

            window.temp = report.geometry;

            // Set the title and unhide the report
            this.setTitleAndShowReport(window.payload.title);

            // Next grab any suitability configurations if they are available, they will be used to perform 
            // a suitability analysis on report.geometry
            report.suitable = window.payload.suitability;

            // Lastly, grab the datasets from the payload and store them in report so we know which 
            // datasets we will perform the above analyses on
            report.datasets = window.payload.datasets;

            // Failure Callback for Mills
            failure = function() {
                // Handle This Issue Here
                // Discuss with Adrienne How to Handle
            };

            // Callback for projected Geometries
            projectionCallback = function (projectedGeometry) {
                if (projectedGeometry.length > 0) {
                    poly.rings = projectedGeometry[0].rings;
                    poly.setSpatialReference(sr);
                    report.geometry = poly;
                    self.beginAnalysis();
                } else {
                    failure();
                }
            };

            // If the geometry is an array, it will be an array of Mill Point Objects with geometry, id, and labels
            // Arrays of polygons are joined before being sent over so the only array will be of mills
            if (Object.prototype.toString.call(report.geometry) === '[object Array]') {
                report.mills = report.geometry;
                var polygons = [];
                // First prepare an array of new polygons with only rings from index 1, rings at index 0
                // represent the center point and are not necessary to be included
                arrayUtils.forEach(report.geometry, function (feature) {
                    poly = new Polygon();
                    poly.addRing(feature.geometry.rings[1]);
                    polygons.push(poly);
                });
                // Then Union the geometries to get one polygon to represent them all,
                // Then reproject the results into the correct projection, 102100 (sr below)
                geometryService.union(polygons, function (unionedGeometry) {
                    poly = new Polygon(unionedGeometry);
                    geometryService.project([poly], sr, projectionCallback, failure);
                }, failure);
                // Add css class to title to size down the font for multiple mills
                domClass.add('title','multiples');
            } else if (report.geometry.radius) {
                // If report.geometry is a circle, we need to make it a new valid polygon
                // Then reproject it in Web Mercator
                report.mills = report.geometry;
                poly = new Polygon();
                poly.addRing(report.geometry.rings[1]);
                geometryService.project([poly], sr, projectionCallback, failure);
            } else {
                // Next, set some properties that we can use to filter what kinds of queries we will be performing
                // Logic for the Wizard was changed, below may not be needed but it left here for reference incase
                // the logic changes again.
                // report.analyzeClearanceAlerts = window.payload.types.forma;
                // report.analyzeTreeCoverLoss = window.payload.types.loss;
                // report.analyzeSuitability = window.payload.types.suit;
                // report.analyzeMillPoints = window.payload.types.risk;
                // var params = new BufferParameters();
                // var polygon = new Polygon(report.geometry);
                // params.geometries = [polygon];
                // params.distances = [1];
                // params.unit = GeometryService.UNIT_FOOT;
                // params.bufferSpatialReference = new SpatialReference(3857);
                // params.outSpatialReference = sr;
                // params.unionResults = true;

                // geometryService.buffer(params, function (bufferedGeometries) {
                //     var newPolygon = new Polygon(bufferedGeometries[0]);
                //     report.geometry = newPolygon;
                //     self.beginAnalysis();
                // });

                this.beginAnalysis();
            }

        },

        /*
			@param  {string} title
		*/
        setTitleAndShowReport: function(title) {
            // The report markup is hidden by default so they user does not see a flash of unstyled content
            // Remove the hidden class at this point and set the title
            document.getElementById("title").innerHTML = title;
            domClass.remove("report", "hidden");
        },

        /*
			Get a lookup list of deferred functions to execute via _getArrayOfRequests
			Fire off a query to get the area of the analysis and clearance alert bounds if necessary
			split the lookup list based on the size to managable chunks using this._chunk
			execute each chunk synchronously so we dont overwhelm the server using processRequests
			  -- These deferred functions will request data, visualize it, and insert it into dom (all in Fetcher)
			uses _getDeferredsForItems to return actual deferreds based on items in lookup list,
			Once the major requests are completed, then fire off the fires query
		*/
        beginAnalysis: function() {

            var requests = this._getArrayOfRequests(),
                self = this,
                chunk;

            // Helper Function to Continue Making Requests if Necessary
            function processRequests() {
                // If the requests array has more chunks to process, process them, else, analysis is complete
                if (requests.length > 0) {
                    // Remove a chunk from the requests array
                    chunk = requests.shift();
                    // Get Deferreds, wait til they are done, then call self to check for more
                    all(self._getDeferredsForItems(chunk)).then(processRequests);
                } else {
                    self.getFiresAnalysis();
                }
            }

            // Get area 
            report.areaPromise = Fetcher.getAreaFromGeometry(report.geometry);

            // If report.analyzeClearanceAlerts is true, get the bounds, else this resolves immediately and moves on
            all([
                Fetcher._getClearanceBounds()
            ]).then(function() {
                // Now that all dependencies and initial Queries are resolved, start processing all the analyses deferreds
                // If the number of requests is less then three, do all now, else chunk the requests and start processing them
                if (requests.length < 3) {
                    all(self._getDeferredsForItems(requests)).then(self.getFiresAnalysis.bind(self));
                } else {
                    // Get an array of arrays, each containing 3 lookup items so 
                    // we can request three analyses at a time
                    requests = requests.chunk(3);
                    processRequests();
                }

            });

        },

        getFiresAnalysis: function() {
            var self = this;
            //if (report.analyzeTreeCoverLoss) {
            all([Fetcher._getFireAlertAnalysis()]).then(self.analysisComplete);
            //} else {
            //	self.analysisComplete();
            //}
        },

        /*
			Analysis is complete, handle that here
		*/
        analysisComplete: function() {

            // Show Print Option as Enabled
            domClass.remove("print", "disabled");

            // Add the Print Listener
            on(dom.byId('print'), 'click', function() {
                domStyle.set("total-area-info-popup", "visibility", "hidden");
                window.print();
            });

            // Remove all loading wheels and show error messages for the remaining ones
            dojoQuery(".loader-wheel").forEach(function(node) {
                // Ignore the Area Query, It's not part of all the deferreds and may not be done by now
                // so lets not prematurely show an error message, Fetcher.getAreaFromGeometry will show an
                // error message if it fails
                if (node.parentNode.id !== 'total-area') {
                    node.parentNode.innerHTML = "There was an error getting these results at this time.";
                }
            });

        },

        /* Helper Functions */

        /*
			Returns array of strings representing which requests need to be made
			@return  {array}
			Deferred Mapping is in comments below this function
		*/
        _getArrayOfRequests: function() {
            var requests = [];

            //if (report.analyzeTreeCoverLoss || report.analyzeClearanceAlerts) {
            for (var key in report.datasets) {
                if (report.datasets[key]) {
                    requests.push(key);
                }
            }
            //}

            return requests;
        },

        /*
			
			Deferred's Mapping

			suit - Fetcher._getSuitabilityAnalysis()
			fires - Fetcher._getFireAlertAnalysis()
			mill - Fetcher._getMillPointAnalysis()
			primForest - Fetcher.getPrimaryForestResults()
			protected - Fetcher.getProtectedAreaResults()
			treeDensity - Fetcher.getTreeCoverResults()
			carbon - Fetcher.getCarbonStocksResults()
			intact - Fetcher.getIntactForestResults()
			landCover - Fetcher.getLandCoverResults()
			legal - Fetcher.getLegalClassResults()
			peat - Fetcher.getPeatLandsResults()
			rspo - Fetcher.getRSPOResults()
		*/

        /*
			@param  {array} item
			@return {array} of deferred functions
		*/
        _getDeferredsForItems: function(items) {
            var deferreds = [];

            arrayUtils.forEach(items, function(item) {

                switch (item) {
                    case "suit":
                        deferreds.push(Fetcher._getSuitabilityAnalysis());
                        break;
                    case "mill":
                        deferreds.push(Fetcher._getMillPointAnalysis());
                        break;
                    case "carbon":
                        deferreds.push(Fetcher.getCarbonStocksResults());
                        break;
                    case "intact":
                        deferreds.push(Fetcher.getIntactForestResults());
                        break;
                    case "landCoverGlob":
                        deferreds.push(Fetcher.getLandCoverGlobalResults());
                        break;
                    case "landCoverAsia":
                        deferreds.push(Fetcher.getLandCoverAsiaResults());
                        break;
                    case "landCoverIndo":
                        deferreds.push(Fetcher.getLandCoverIndonesiaResults());
                        break;
                    case "legal":
                        deferreds.push(Fetcher.getLegalClassResults());
                        break;
                    case "peat":
                        deferreds.push(Fetcher.getPeatLandsResults());
                        break;
                    case "primForest":
                        deferreds.push(Fetcher.getPrimaryForestResults());
                        break;
                    case "protected":
                        deferreds.push(Fetcher.getProtectedAreaResults());
                        break;
                    case "rspo":
                        deferreds.push(Fetcher.getRSPOResults());
                        break;
                    case "treeDensity":
                        deferreds.push(Fetcher.getTreeCoverResults());
                        break;
                    case "treeCoverLoss":
                        deferreds.push(Fetcher.getTreeCoverLossResults());
                        break;
                    default:
                        break;
                }

            });

            return deferreds;
        },

        addSubscriptionDialog: function() {
            var dialog = new Dialog({
                    title: 'Subscribe to Alerts!',
                    style: 'width: 300px;'
                }),
                self = this,
                content = "<div class='subscription-content'>" +
                "<div class='checkbox-container'><label><input id='forma_check' type='checkbox' value='clearance' />Monthly Clearance Alerts</label></div>" +
                "<div class='checkbox-container'><label><input id='fires_check' type='checkbox' value='fires' />Fire Alerts</label></div>" +
                "<div class='email-container'><input id='user-email' type='text' placeholder='something@gmail.com'/></div>" +
                "<div class='submit-container'><button id='subscribe-now'>Subscribe</button></div>" +
                "<div id='form-response' class='message-container'></div>" +
                "</div>";

            dialog.setContent(content);

            on(dom.byId("subscribeToAlerts"), 'click', function() {
                dialog.show();
            });

            on(dom.byId("subscribe-now"), 'click', function() {
                // Show loading Wheel
                // It will be removed when there is an error or on complete
                dom.byId('form-response').innerHTML = "<div class='loader-wheel subscribe'>subscribing</div>";
                self.subscribeToAlerts();
            });

        },

        subscribeToAlerts: function() {
            var geoJson = this.convertGeometryToGeometric(report.geometry),
                emailAddr = dom.byId('user-email').value,
                formaCheck = dom.byId('forma_check').checked,
                firesCheck = dom.byId('fires_check').checked,
                errorMessages = [],
                messages = {};

            // Set up the text for the messages
            messages.invalidEmail = 'You must provide a valid email in the form.';
            messages.noSelection = 'You must select at least one checkbox from the form.';
            messages.formaSuccess = 'Thank you for subscribing to Forma Alerts.  You should receive a confirmation email soon.';
            messages.formaFail = 'There was an error with your request to subscribe to Forma alerts.  Please try again later.';
            messages.fireSuccess = 'Thank you for subscribing to Fires Alerts.  You should receive a confirmation email soon.';
            messages.fireFail = 'There was an error with your request to subscribe to Fires alerts.  Please try again later.';

            if (!validate.isEmailAddress(emailAddr)) {
                errorMessages.push(messages.invalidEmail);
            }

            if (!formaCheck && !firesCheck) {
                errorMessages.push(messages.noSelection);
            }

            if (errorMessages.length > 0) {
                alert('Please fill in the following:\n' + errorMessages.join('\n'));
            } else {
                // If both are checked, request both and show the appropriate responses
                if (formaCheck && firesCheck) {
                    var responses = [];
                    all([
                        this.subscribeToForma(geoJson, emailAddr),
                        this.subscribeToFires(report.geometry, emailAddr)
                    ]).then(function(results) {
                        // Check the results and inform the user of the results
                        if (results[0]) {
                            responses.push(messages.formaSuccess);
                        } else {
                            responses.push(messages.formaFail);
                        }

                        if (results[1]) {
                            responses.push(messages.fireSuccess);
                        } else {
                            responses.push(messages.fireFail);
                        }

                        dom.byId('form-response').innerHTML = responses.join('<br />');

                    });

                    // Else if just forma alerts are checked, subscribe to those and show the correct responses
                } else if (formaCheck) {
                    this.subscribeToForma(geoJson, emailAddr).then(function(res) {
                        if (res) {
                            dom.byId('form-response').innerHTML = messages.formaSuccess;
                        } else {
                            dom.byId('form-response').innerHTML = messages.formaFail;
                        }
                    });
                    // Else if just fires alerts are checked, subscribe to those and show the correct responses
                } else if (firesCheck) {
                    this.subscribeToFires(report.geometry, emailAddr).then(function(res) {
                        if (res) {
                            dom.byId('form-response').innerHTML = messages.fireSuccess;
                        } else {
                            dom.byId('form-response').innerHTML = messages.fireFail;
                        }
                    });
                }

            }

        },

        subscribeToForma: function(geoJson, email) {
            var url = Config.alertUrl.forma,
                deferred = new Deferred(),
                req = new XMLHttpRequest(),
                params = JSON.stringify({
                    'topic': 'updates/forma',
                    'geom': '{"type": "' + geoJson.type + '", "coordinates":[' + JSON.stringify(geoJson.geom) + ']}',
                    'email': email
                }),
                res;

            req.open('POST', url, true);
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    res = JSON.parse(req.response);
                    deferred.resolve(res.subscribe);
                }
            };
            // Handle any potential network errors here
            // If there is an application level error, catch it above
            req.addEventListener('error', function() {
                deferred.resolve(false);
            }, false);

            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            req.send(params);
            return deferred.promise;
        },

        subscribeToFires: function(geometry, email) {
            var url = Config.alertUrl.fires,
                deferred = new Deferred(),
                // req = new XMLHttpRequest(),
                params = {
                    'features': JSON.stringify({
                        "rings": geometry.rings,
                        "spatialReference": geometry.spatialReference
                    }),
                    'msg_addr': email,
                    'msg_type': 'email',
                    'area_name': payload.title
                },
                res;

            xhr(url, {
                handleAs: "json",
                method: "POST",
                data: params
            }).then(function() {
                deferred.resolve(true);
            }, function(err) {
                deferred.resolve(false);
            });

            return deferred.promise;

        },

        convertGeometryToGeometric: function(geometry) {
            var sr = new SpatialReference({
                    wkid: 102100
                }),
                geometryArray = [],
                newRings = [],
                geo,
                pt;

            // Helper function to determine if the coordinate is already in the array
            // This signifies the completion of a ring and means I need to reset the newRings
            // and start adding coordinates to the new newRings array
            function sameCoords(arr, coords) {
                var result = false;
                arrayUtils.forEach(arr, function(item) {
                    if (item[0] === coords[0] && item[1] === coords[1]) {
                        result = true;
                    }
                });
                return result;
            }

            arrayUtils.forEach(geometry.rings, function(ringers) {
                arrayUtils.forEach(ringers, function(ring) {
                    pt = new Point(ring, sr);
                    geo = webMercatorUtils.xyToLngLat(pt.x, pt.y);
                    if (sameCoords(newRings, geo)) {
                        newRings.push(geo);
                        geometryArray.push(newRings);
                        newRings = [];
                    } else {
                        newRings.push(geo);
                    }
                });
            });

            return {
                geom: geometryArray.length > 1 ? geometryArray : geometryArray[0],
                type: geometryArray.length > 1 ? "MultiPolygon" : "Polygon"
            };
        }

    };

});