define([

    "dojo/number",
    "dojo/Deferred",
    "dojo/promise/all",
    // My Modules
    "report/config",
    "report/Renderer",
    "report/Suitability",
    // esri modules
    "esri/request",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/SpatialReference",
    "esri/geometry/Polygon",
    "esri/tasks/GeometryService",
    "esri/tasks/AreasAndLengthsParameters"
], function(dojoNumber, Deferred, all, ReportConfig, ReportRenderer, Suitability, esriRequest, Query, QueryTask, SpatialReference, Polygon, GeometryService, AreasAndLengthsParameters) {
    'use strict';

    var _fireQueriesToRender = [];

    return {

        getAreaFromGeometry: function(geometry) {
            this._debug('Fetcher >>> getAreaFromGeometry');
            var deferred = new Deferred(),
                geometryService = new GeometryService(ReportConfig.geometryServiceUrl),
                parameters = new AreasAndLengthsParameters(),
                sr = new SpatialReference(54012),
                polygon = new Polygon(geometry),
                errorString = "Not Available",
                area;

            function success(result) {
                if (result.areas.length === 1) {
                    area = dojoNumber.format(result.areas[0], {
                        places: 0
                    });
                    report.area = result.areas[0];
                    deferred.resolve(true);
                } else {
                    area = errorString;
                    deferred.resolve(false);
                }
                document.getElementById("total-area").innerHTML = area;
            }

            function failure(err) {
                document.getElementById("total-area").innerHTML = errorString;
                deferred.resolve(false);
            }

            // Project Geometry in Eckert Spatial Reference
            // Then Simplify the Geometry, then get Areas and Lengths
            parameters.areaUnit = GeometryService.UNIT_HECTARES;
            geometryService.project([polygon], sr, function(projectedGeometry) {
                if (projectedGeometry.length > 0) {
                    polygon.rings = projectedGeometry[0].rings;
                    polygon.setSpatialReference(sr);
                } else {
                    failure();
                }
                geometryService.simplify([polygon], function(simplifiedGeometry) {
                    parameters.polygons = simplifiedGeometry;
                    geometryService.areasAndLengths(parameters, success, failure);
                }, failure);
            }, failure);

            return deferred.promise;
        },

        getPrimaryForestResults: function() {
            this._debug('Fetcher >>> getPrimaryForestResults');
            var deferred = new Deferred(),
                config = ReportConfig.primaryForest;

            // Create the container for all the results
            // Add this config to Fires so the Fires request knows to add data here
            ReportRenderer.renderContainers(config);
            _fireQueriesToRender.push(config);

            all([
                this._getTotalLossAnalysis(config),
                this._getClearanceAlertAnalysis(config),
                this._getCompositionAnalysis(config)
            ]).then(function() {
                deferred.resolve(true);
            });

            return deferred.promise;
        },

        getTreeCoverResults: function() {
            this._debug('Fetcher >>> getTreeCoverResults');
            var deferred = new Deferred(),
                config = ReportConfig.treeCover;

            // Create the container for all the results
            // Add this config to Fires so the Fires request knows to add data here
            ReportRenderer.renderContainers(config);
            _fireQueriesToRender.push(config);

            all([
                this._getTotalLossAnalysis(config),
                this._getClearanceAlertAnalysis(config)
            ]).then(function() {
                deferred.resolve(true);
            });

            return deferred.promise;
        },

        getTreeCoverLossResults: function() {
            this._debug('Fetcher >>> getTreeCoverLossResults');
            var deferred = new Deferred(),
                config = ReportConfig.treeCoverLoss,
                url = ReportConfig.imageServiceUrl,
                rasterId = config.rasterId,
                content = {
                    geometryType: 'esriGeometryPolygon',
                    geometry: JSON.stringify(report.geometry),
                    mosaicRule: JSON.stringify(config.mosaicRule),
                    pixelSize: (report.geometry.rings.length > 45) ? 500 : 100,
                    f: 'json'
                },
                self = this;


            // Create the container for all the result
            ReportRenderer.renderTotalLossContainer(config);

            function success(response) {
                if (response.histograms.length > 0) {
                    ReportRenderer.renderTreeCoverLossData(response.histograms[0].counts, content.pixelSize, config);
                } else {
                    ReportRenderer.renderAsUnavailable('loss', config);
                }
                deferred.resolve(true);
            }

            function failure(error) {
                if (error.details) {
                    if (error.details[0] === 'The requested image exceeds the size limit.' && content.pixelSize !== 500) {
                        content.pixelSize = 500;
                        self._computeHistogram(url, content, success, failure);
                    } else {
                        deferred.resolve(false);
                    }
                } else {
                    deferred.resolve(false);
                }
            }

            this._computeHistogram(url, content, success, failure);

            return deferred.promise;
        },

        getLegalClassResults: function() {
            this._debug('Fetcher >>> getLegalClassResults');
            var deferred = new Deferred(),
                config = ReportConfig.legalClass;

            // Create the container for all the results
            // Add this config to Fires so the Fires request knows to add data here
            ReportRenderer.renderContainers(config);
            _fireQueriesToRender.push(config);

            all([
                this._getTotalLossAnalysis(config),
                this._getClearanceAlertAnalysis(config)
            ]).then(function() {
                deferred.resolve(true);
            });

            return deferred.promise;
        },

        getProtectedAreaResults: function() {
            this._debug('Fetcher >>> getProtectedAreaResults');
            var deferred = new Deferred(),
                config = ReportConfig.protectedArea;

            // Create the container for all the results
            // Add this config to Fires so the Fires request knows to add data here
            ReportRenderer.renderContainers(config);
            _fireQueriesToRender.push(config);

            // true below as 2nd param means use simplified rendering rule, encoder.getSimpleRule
            all([
                this._getTotalLossAnalysis(config, true),
                this._getClearanceAlertAnalysis(config, true)
            ]).then(function() {
                deferred.resolve(true);
            });

            return deferred.promise;
        },

        getCarbonStocksResults: function() {
            this._debug('Fetcher >>> getCarbonStocksResults');
            var deferred = new Deferred(),
                config = ReportConfig.carbonStock;

            // Create the container for all the results
            // Add this config to Fires so the Fires request knows to add data here
            ReportRenderer.renderContainers(config);
            _fireQueriesToRender.push(config);

            all([
                this._getTotalLossAnalysis(config),
                this._getClearanceAlertAnalysis(config)
            ]).then(function() {
                deferred.resolve(true);
            });

            return deferred.promise;
        },

        getIntactForestResults: function() {
            this._debug('Fetcher >>> getIntactForestResults');
            var deferred = new Deferred(),
                config = ReportConfig.intactForest;

            // Create the container for all the results
            // Add this config to Fires so the Fires request knows to add data here
            ReportRenderer.renderContainers(config);
            _fireQueriesToRender.push(config);

            // true below as 2nd param means use simplified rendering rule, encoder.getSimpleRule
            all([
                this._getTotalLossAnalysis(config, true),
                this._getClearanceAlertAnalysis(config, true)
            ]).then(function() {
                deferred.resolve(true);
            });

            return deferred.promise;
        },

        getLandCoverGlobalResults: function() {
            this._debug('Fetcher >>> getLandCoverGlobalResults');
            var deferred = new Deferred(),
                config = ReportConfig.landCoverGlobal;

            // Create the container for all the results
            // Add this config to Fires so the Fires request knows to add data here
            ReportRenderer.renderContainers(config);
            _fireQueriesToRender.push(config);

            all([
                this._getTotalLossAnalysis(config),
                this._getClearanceAlertAnalysis(config)
            ]).then(function() {
                deferred.resolve(true);
            });

            return deferred.promise;
        },

        getLandCoverAsiaResults: function() {
            this._debug('Fetcher >>> getLandCoverAsiaResults');
            var deferred = new Deferred(),
                config = ReportConfig.landCoverAsia;

            // Create the container for all the results
            // Add this config to Fires so the Fires request knows to add data here
            ReportRenderer.renderContainers(config);
            _fireQueriesToRender.push(config);

            all([
                this._getTotalLossAnalysis(config),
                this._getClearanceAlertAnalysis(config)
            ]).then(function() {
                deferred.resolve(true);
            });

            return deferred.promise;
        },

        getLandCoverIndonesiaResults: function() {
            this._debug('Fetcher >>> getLandCoverIndonesiaResults');
            var deferred = new Deferred(),
                config = ReportConfig.landCoverIndo;

            // Create the container for all the results
            // Add this config to Fires so the Fires request knows to add data here
            ReportRenderer.renderContainers(config);
            _fireQueriesToRender.push(config);

            all([
                this._getTotalLossAnalysis(config),
                this._getClearanceAlertAnalysis(config)
            ]).then(function() {
                deferred.resolve(true);
            });

            return deferred.promise;
        },

        getPeatLandsResults: function() {
            this._debug('Fetcher >>> getPeatLandsResults');
            var deferred = new Deferred(),
                config = ReportConfig.peatLands;

            // Create the container for all the results
            // Add this config to Fires so the Fires request knows to add data here
            ReportRenderer.renderContainers(config);
            _fireQueriesToRender.push(config);

            // true below as 2nd param means use simplified rendering rule, encoder.getSimpleRule
            all([
                this._getTotalLossAnalysis(config, true),
                this._getClearanceAlertAnalysis(config, true)
            ]).then(function() {
                deferred.resolve(true);
            });

            return deferred.promise;
        },

        getRSPOResults: function() {
            this._debug('Fetcher >>> getRSPOResults');
            var deferred = new Deferred(),
                config = ReportConfig.rspo,
                url = ReportConfig.imageServiceUrl,
                encoder = this._getEncodingFunction(config.lossBounds, config.bounds),
                renderingRule = encoder.render(ReportConfig.totalLoss.rasterId, config.rasterId),
                content = {
                    geometryType: 'esriGeometryPolygon',
                    geometry: JSON.stringify(report.geometry),
                    renderingRule: renderingRule,
                    pixelSize: 100,
                    f: 'json'
                },
                self = this;

            function success(res) {
                ReportRenderer.renderRSPOData(res, config, encoder);
                deferred.resolve(true);
            }

            function failure(error) {
                if (error.details) {
                    if (error.details[0] === 'The requested image exceeds the size limit.' && content.pixelSize !== 500) {
                        content.pixelSize = 500;
                        self._computeHistogram(url, content, success, failure);
                    } else {
                        deferred.resolve(false);
                    }
                } else {
                    deferred.resolve(false);
                }
            }

            ReportRenderer.renderRSPOContainer(config);
            this._computeHistogram(url, content, success, failure);
            return deferred.promise;
        },

        // Main Query Calls Go Here

        _getTotalLossAnalysis: function(config, useSimpleEncoderRule) {
            this._debug('Fetcher >>> _getTotalLossAnalysis');
            var deferred = new Deferred(),
                lossConfig = ReportConfig.totalLoss,
                url = ReportConfig.imageServiceUrl,
                encoder = this._getEncodingFunction(lossConfig.bounds, config.bounds),
                rasterId = config.rasterRemap ? config.rasterRemap : config.rasterId,
                renderingRule = useSimpleEncoderRule ?
                    encoder.getSimpleRule(lossConfig.rasterId, rasterId) :
                    encoder.render(lossConfig.rasterId, rasterId),
                content = {
                    geometryType: 'esriGeometryPolygon',
                    geometry: JSON.stringify(report.geometry),
                    renderingRule: renderingRule,
                    pixelSize: (report.geometry.rings.length > 45) ? 500 : 100,
                    f: 'json'
                },
                self = this;

            function success(response) {
                if (response.histograms.length > 0) {
                    ReportRenderer.renderLossData(response.histograms[0].counts, content.pixelSize, config, encoder, useSimpleEncoderRule);
                } else {
                    ReportRenderer.renderAsUnavailable('loss', config);
                }
                deferred.resolve(true);
            }

            function failure(error) {
                if (error.details) {
                    if (error.details[0] === 'The requested image exceeds the size limit.' && content.pixelSize !== 500) {
                        content.pixelSize = 500;
                        self._computeHistogram(url, content, success, failure);
                    } else {
                        deferred.resolve(false);
                    }
                } else {
                    deferred.resolve(false);
                }
            }

            // If the report analyzeTreeCoverLoss is false, just resolve here
            //if (report.analyzeTreeCoverLoss) {
            this._computeHistogram(url, content, success, failure);
            //} else {
            // deferred.resolve(true);
            //}

            return deferred.promise;
        },

        _getClearanceAlertAnalysis: function(config, useSimpleEncoderRule) {
            this._debug('Fetcher >>> _getClearanceAlertAnalysis');
            var deferred = new Deferred(),
                clearanceConfig = ReportConfig.clearanceAlerts,
                url = ReportConfig.clearanceAnalysisUrl,
                self = this,
                renderingRule,
                rasterId,
                content,
                encoder;

            function success(response) {
                if (response.histograms.length > 0) {
                    ReportRenderer.renderClearanceData(response.histograms[0].counts, content.pixelSize, config, encoder, useSimpleEncoderRule);
                } else {
                    ReportRenderer.renderAsUnavailable('clearance', config);
                }
                deferred.resolve(true);
            }

            function failure(err) {
                deferred.resolve(false);
            }


            /*
            * Some layers have special ids that need to be overwritten from the config becuase
            * the config powers multiple charts and the clearance alerts analysis is the onlyone that
            * uses a different value, if more layers need this, five them a 'formaId' in report/config.js
            */
            if (config.formaId) {
                config.rasterId = config.formaId;
                if (config.includeFormaIdInRemap) {
                    config.rasterRemap.rasterFunctionArguments.Raster = config.formaId;
                }
            }
            
            // If the report analyzeClearanceAlerts is false, just resolve here
            //if (report.analyzeClearanceAlerts) {
            encoder = this._getEncodingFunction(report.clearanceBounds, config.bounds);
            rasterId = config.rasterRemap ? config.rasterRemap : config.rasterId;
            renderingRule = useSimpleEncoderRule ?
                encoder.getSimpleRule(clearanceConfig.rasterId, rasterId) :
                encoder.render(clearanceConfig.rasterId, rasterId);
            content = {
                geometryType: 'esriGeometryPolygon',
                geometry: JSON.stringify(report.geometry),
                renderingRule: renderingRule,
                pixelSize: 500, // FORMA data has a pixel size of 500 so this must be 500 otherwise results will be off
                f: 'json'
            };
            this._computeHistogram(url, content, success, failure);
            //} else {
            //  deferred.resolve(true);
            //}

            return deferred.promise;
        },

        _getCompositionAnalysis: function(config) {
            var deferred = new Deferred(),
                url = 'http://46.137.239.227/arcgis/rest/services/CommoditiesAnalyzer/GFWCanalysis/ImageServer',
                content = {
                    geometryType: 'esriGeometryPolygon',
                    geometry: JSON.stringify(report.geometry),
                    mosaicRule: JSON.stringify({
                        'mosaicMethod': 'esriMosaicLockRaster',
                        'lockRasterIds': [3],
                        'ascending': true,
                        'mosaicOperation': 'MT_FIRST'
                    }),
                    pixelSize: (report.geometry.rings.length > 45) ? 500 : 100,
                    f: 'json'
                },
                self = this
                ;

            function success(response) {
                if (response.histograms.length > 0) {
                    console.debug(response.histograms[0].counts);
                    ReportRenderer.renderCompositionAnalysis(response.histograms[0].counts, content.pixelSize, config);
                } else {
                    console.debug('Render composition analysis unavailable');
                    ReportRenderer.renderAsUnavailable('composition', config);
                }
                deferred.resolve(true);
            }

            function failure(error) {
                if (error.details) {
                    if (error.details[0] === 'The requested image exceeds the size limit.' && content.pixelSize !== 500) {
                        content.pixelSize = 500;
                        self._computeHistogram(url, content, success, failure);
                    } else {
                        deferred.resolve(false);
                    }
                } else {
                    deferred.resolve(false);
                }
            }

            this._computeHistogram(url, content, success, failure);
        
            return deferred.promise;
        },

        _getSuitabilityAnalysis: function() {
            this._debug('Fetcher >>> _getSuitabilityAnalysis');
            var deferred = new Deferred(),
                config = ReportConfig.suitability;

            // Create the container for the results
            ReportRenderer.renderSuitabilityContainer(config);

            // Offload the work to Suitability as it is several small requests
            Suitability.getSuitabilityData().then(function(payload) {
                ReportRenderer.renderSuitabilityData(config, payload);
                deferred.resolve(true);
            });

            return deferred.promise;
        },

        _getMillPointAnalysis: function() {

            this._debug('Fetcher >>> _getMillPointAnalysis');
            var deferred = new Deferred(),
                config = ReportConfig.millPoints,
                response,
                req;

            // Create the container for the results
            ReportRenderer.renderMillContainer(config);

            // Get Results from API
            req = new XMLHttpRequest();

            window.shortcutConfig = config;
            // req.open('POST', config.url, true);
            req.open('POST', config.url, true);
            req.onreadystatechange = function (res) {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        response = JSON.parse(req.response);
                        if (response.mills) {
                            ReportRenderer.renderMillAssessment(response.mills, config);
                            deferred.resolve(true);
                        } else {
                            deferred.resolve(false);
                        }
                    } else {
                      deferred.resolve(false);
                    }
                }
            };

            req.addEventListener('error', function () {
              deferred.resolve(false);
            }, false);
            
            var formData = new FormData();
            formData.append("mills",report.mills.map(function(mill){return mill.id}).join(','));

            // Construct the POST Content in HERE for each Mill
            req.send( formData );

            return deferred.promise;
        },

        _getFireAlertAnalysis: function() {
            this._debug('Fetcher >>> _getFireAlertAnalysis');
            var deferred = new Deferred(),
                polygon = new Polygon(report.geometry),
                errorCount = 0,
                self = this,
                defs = [],
                params2,
                params1,
                task2,
                task1;

            params1 = new Query();
            params2 = new Query();

            task1 = new QueryTask(ReportConfig.fires.url + "/0");
            task2 = new QueryTask(ReportConfig.fires.url + "/2");

            params1.geometry = polygon;
            params2.geometry = polygon;
            params1.returnGeometry = false;
            params2.returnGeometry = false;
            params1.outFields = ["*"];
            params2.outFields = ["*"];
            params1.where = "1 = 1";
            params2.where = "1 = 1";

            all([
                task1.execute(params1),
                task2.execute(params2)
            ]).then(function(results) {
                ReportRenderer.renderFireData(_fireQueriesToRender, results);
                deferred.resolve(true);
            });

            // Handle the possibility of these functions both erroring out
            task1.on('error', function() {
                deferred.resolve(false);
            });

            task2.on('error', function() {
                deferred.resolve(false);
            });

            return deferred.promise;
        },

        _getClearanceBounds: function() {
            this._debug('Fetcher >>> _getClearanceBounds');
            var config = ReportConfig.clearanceBounds,
                deferred = new Deferred(),
                incrementer = 0,
                month,
                req;
 
            //if (report.analyzeClearanceAlerts) {
            req = esriRequest({
                url: config.url,
                content: {
                    f: 'pjson'
                },
                handleAs: 'json',
                callbackParamName: 'callback'
            });

            req.then(function(res) {
                report.clearanceBounds = [res.minValues[0], res.maxValues[0]];
                report.clearanceLabels = [];
                for (var i = res.minValues[0], length = res.maxValues[0]; i <= length; i++) {
                    month = i % 12 === 0 ? 12 : i % 12;
                    report.clearanceLabels.push(month + "-" + (config.baseYearLabel + incrementer));
                    if (i % 12 === 0) {
                        ++incrementer;
                    }
                }
                deferred.resolve(true);
            }, function(err) {
                deferred.resolve(false, err);
            });
            // } else {
            // 	deferred.resolve(true);
            // }

            return deferred.promise;

        },

        _getEncodingFunction: function(arrayA, arrayB, options) {

            var self = this;

            return {
                A: arrayA.fromBounds(),
                B: arrayB.fromBounds(),
                getSimpleRule: function(id1, id2) {
                    return JSON.stringify({
                        'rasterFunction': 'Arithmetic',
                        'rasterFunctionArguments': {
                            'Raster': id1,
                            'Raster2': id2,
                            'Operation': 3
                        }
                    });
                },
                renderRule: function(id1, id2) {
                    return {
                        'rasterFunction': 'Arithmetic',
                        'rasterFunctionArguments': {
                            'Raster': {
                                'rasterFunction': 'Arithmetic',
                                'rasterFunctionArguments': {
                                    'Raster': {
                                        'rasterFunction': 'Remap',
                                        'rasterFunctionArguments': {
                                            'InputRanges': [this.A[0], (this.A[this.A.length - 1]) + 1],
                                            'OutputValues': [this.B.length],
                                            'Raster': id1,
                                            'AllowUnmatched': false
                                        }
                                    },
                                    'Raster2': id1,
                                    'Operation': 3
                                }
                            },
                            'Raster2': id2,
                            'Operation': 1
                        }
                    };
                },
                render: function(id1, id2) {
                    return JSON.stringify(this.renderRule(id1, id2));
                },
                encode: function(a, b) {
                    // Get Unique Value for Two Input Values
                    return this.B.length * a + b;
                },
                decode: function(value) {
                    // Ge the input values back from a known output value
                    var b = value % this.B.length;
                    var a = (value - b) / this.B.length;
                    return [a, b];
                }
            };

        },

        /*
			Simple wrapper function for making requests to computeHistogram
		*/
        _computeHistogram: function(url, content, callback, errback) {
            var req = esriRequest({
                url: url + '/computeHistograms',
                content: content,
                handleAs: 'json',
                callbackParamName: 'callback',
                timeout: 60000
            }, {
                usePost: true
            });

            req.then(callback, errback);
        },

        /*
			Wrapper function for logging messages
		*/
        _debug: function(msg) {
            //console.log(msg);
        }


    };

});