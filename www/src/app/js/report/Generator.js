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
    "report/Fetcher",
    "report/CSVExporter"
], function (on, dom, dojoQuery, esriConfig, xhr, Deferred, domClass, domStyle, all, arrayUtils, Dialog, validate, Point, Polygon, SpatialReference, GeometryService, webMercatorUtils, Config, Fetcher, CSVExporter) {
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

            // Set defaults for Highcharts
            Highcharts.setOptions({
                chart: {
                    style: {
                        fontFamily: "'Fira Sans', 'fira_sans_otregular', Georgia, serif"
                    }
                }
            });

            // RSPO Column Chart and Suitabiltiy Pie Chart are done and working
            this.addCSVOptionToHighcharts();

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

        addCSVOptionToHighcharts: function () {
            
            var self = this;

            function generateCSV () {
                // This refers to chart context, not Generator context
                // changing this or binding context to generateCSV will cause problems
                // as we need the context to be the chart
                var featureTitle = document.getElementById('title').innerHTML,
                    type = this.options.chart.type,
                    lineEnding = '\r\n',
                    content = [],
                    csvData,
                    output;

                // All Charts have a title except RSPO Land Use Change Analysis
                // If the type is column, it's the RSPO Chart so return that for a title
                content.push(type === 'column' ? 'RSPO Land Use Change Analysis' : this.title.textStr);
                content.push(featureTitle);

                // If type is bar it could be the loss charts or the suitable chart, check the number of xAxes.
                // The suitability composition breakdown has two x axes while all others have one
                // Use that as the determining factor but if more charts are added in the future, 
                // this check may need to be updated
                if (type === 'bar' && this.xAxis.length > 1) {
                    // Pass in the reference to the chart
                    csvData = CSVExporter.exportCompositionAnalysis(this);
                    content = content.concat(csvData);
                } else if (type === 'pie') {
                    // Suitability by Legal Classification 
                    // Pass in the reference to the chart
                    csvData = CSVExporter.exportSuitabilityByLegalClass(this);
                    content = content.concat(csvData);                    
                } else {
                    // Its either a bar chart with one axis, line chart, or column chart
                    // Pass in the reference to the chart
                    csvData = CSVExporter.exportSimpleChartAnalysis(this);
                    content = content.concat(csvData);
                }

                // If only the chart title and feature title are in, then no data was exported so
                // don't continue
                if (content.length > 1) {
                    output = content.join(lineEnding);
                }

                if (output) {
                    CSVExporter.exportCSV(output);
                }
            }

            Highcharts.getOptions().exporting.buttons.contextButton.menuItems.push({
                text: 'Download CSV',
                onclick: generateCSV
            });

        },

        prepareForAnalysis: function() {

            var self = this,
                geometryService = new GeometryService(Config.geometryServiceUrl),
                sr = new SpatialReference(102100),
                projectionCallback,
                polygons,
                failure,
                poly;

            // Set the title and unhide the report
            this.setTitleAndShowReport(window.payload.title);

            // Next grab any suitability configurations if they are available, they will be used to perform 
            // a suitability analysis on report.geometry
            report.suitable = window.payload.suitability;

            // Lastly, grab the datasets from the payload and store them in report so we know which 
            // datasets we will perform the above analyses on
            report.datasets = window.payload.datasets;

            // Parse the geometry from the global payload object
            var areasToAnalyze = JSON.parse(window.payload.geometry);

            // If we have a single polygon, grab the geometry and begin
            // If we have a single circle, convert to polygon and then continue
            if (areasToAnalyze.length === 1) {

              var geometryPayload = areasToAnalyze[0];

              if (geometryPayload.geometry.radius) {
                // Save the areas to the report.mills incase they are doing mill point analysis, we will need these
                report.mills = areasToAnalyze;
                poly = new Polygon(sr);
                poly.addRing(geometryPayload.geometry.rings[geometryPayload.geometry.rings.length - 1]);
                report.geometry = poly;
              } else if (geometryPayload.geometry.type === 'polygon') {
                report.geometry = geometryPayload.geometry;
              }

              this.beginAnalysis();

            } else {

              // Currently this can only be an array of mills, may change later
              // First I will need to convert circles to polygons since unioning circles/computing histograms
              //  has some unexpected outcomes, Also keep a reference of the mills

              report.mills = areasToAnalyze;
              polygons = [];

              arrayUtils.forEach(areasToAnalyze, function (feature) {
                  poly = new Polygon(sr);
                  poly.addRing(feature.geometry.rings[feature.geometry.rings.length - 1]);
                  polygons.push(poly);
              });

              // Now Union the Geometries, then reproject them into the correct spatial reference
              geometryService.union(polygons, function (unionedGeometry) {
                  poly = new Polygon(unionedGeometry);
                  report.geometry = poly;
                  self.beginAnalysis();
              });

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
            all([Fetcher._getFireAlertAnalysis()]).then(self.analysisComplete);
        },

        /*
            Analysis is complete, handle that here
        */
        analysisComplete: function() {

            // Generate Print Request to get URL
            Fetcher.setupMap();

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
                if (node.parentNode.id !== 'total-area' && node.parentNode.id !== 'print-map') {
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

            for (var key in report.datasets) {
                if (report.datasets[key]) {
                    requests.push(key);
                }
            }

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
            @param  {array} items
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
                    case "indonesiaMoratorium":
                        deferreds.push(Fetcher.getIndonesiaMoratoriumResults());
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
