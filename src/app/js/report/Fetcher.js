define([
	"dojo/number",
	"dojo/Deferred",
	"dojo/promise/all",
	// My Modules
	"report/config",
	"report/Renderer",
	// esri modules
	"esri/request",
	"esri/geometry/Polygon",
	"esri/tasks/GeometryService",
  "esri/tasks/AreasAndLengthsParameters"
], function (dojoNumber, Deferred, all, ReportConfig, ReportRenderer, esriRequest, Polygon, GeometryService, AreasAndLengthsParameters) {
	'use strict';

	return {

		getAreaFromGeometry: function (geometry) {
			this._debug('Fetcher >>> getAreaFromGeometry');
			var geometryService = new GeometryService(ReportConfig.geometryServiceUrl),
					parameters = new AreasAndLengthsParameters(),
					polygon = new Polygon(geometry),
					errorString = "Not Available",
					area;

			function success(result) {
				if (result.areas.length === 1) {
					area = dojoNumber.format(result.areas[0], {places: 2} );
				} else {
					area = errorString;
				}
				document.getElementById("total-area").innerHTML = area;
			}

			function failure(err) {
				document.getElementById("total-area").innerHTML = errorString;
			}

			parameters.areaUnit = GeometryService.UNIT_HECTARES;
			geometryService.simplify([polygon], function (simplifiedGeometry) {
				parameters.polygons = simplifiedGeometry;
				geometryService.areasAndLengths(parameters, success, failure);
			}, failure);

		},

		getPrimaryForestResults: function () {
			this._debug('Fetcher >>> getPrimaryForestResults');
			var deferred = new Deferred(),
					config = ReportConfig.primaryForest;

			// Create the container for all the results
			ReportRenderer.renderContainers(config);

			all([
				this._getTotalLossAnalysis(config),
				this._getClearanceAlertAnalysis(config)
			]).then(function () {
				deferred.resolve(true);
			});

			return deferred.promise;
		},

		getTreeCoverResults: function () {
			this._debug('Fetcher >>> getTreeCoverResults');
			var deferred = new Deferred();
			
			all([
				this._getTotalLossAnalysis(),
				this._getClearanceAlertAnalysis()
			]).then(function () {
				deferred.resolve(true);
			});

			return deferred.promise;
		},

		getLegalClassResults: function () {
			this._debug('Fetcher >>> getLegalClassResults');
			var deferred = new Deferred();
			
			all([
				this._getTotalLossAnalysis(),
				this._getClearanceAlertAnalysis()
			]).then(function () {
				deferred.resolve(true);
			});

			return deferred.promise;
		},

		getProtectedAreaResults: function () {
			this._debug('Fetcher >>> getProtectedAreaResults');
			var deferred = new Deferred();
			
			all([
				this._getTotalLossAnalysis(),
				this._getClearanceAlertAnalysis()
			]).then(function () {
				deferred.resolve(true);
			});

			return deferred.promise;
		},

		getCarbonStocksResults: function () {
			this._debug('Fetcher >>> getCarbonStocksResults');
			var deferred = new Deferred();
			
			all([
				this._getTotalLossAnalysis(),
				this._getClearanceAlertAnalysis()
			]).then(function () {
				deferred.resolve(true);
			});

			return deferred.promise;
		},

		getIntactForestResults: function () {
			this._debug('Fetcher >>> getIntactForestResults');
			var deferred = new Deferred();
			
			all([
				this._getTotalLossAnalysis(),
				this._getClearanceAlertAnalysis()
			]).then(function () {
				deferred.resolve(true);
			});

			return deferred.promise;
		},

		getLandCoverResults: function () {
			this._debug('Fetcher >>> getLandCoverResults');
			var deferred = new Deferred();
			
			all([
				this._getTotalLossAnalysis(),
				this._getClearanceAlertAnalysis()
			]).then(function () {
				deferred.resolve(true);
			});

			return deferred.promise;
		},

		getPeatLandsResults: function () {
			this._debug('Fetcher >>> getPeatLandsResults');
			var deferred = new Deferred(),
					config = ReportConfig.peatLands;

			// Create the container for all the results
			ReportRenderer.renderContainers(config);
			// true below as 2nd param means use simplified rendering rule, encoder.getSimpleRule
			all([
				this._getTotalLossAnalysis(config, true),
				this._getClearanceAlertAnalysis(config, true)
			]).then(function () {
				deferred.resolve(true);
			});

			return deferred.promise;
		},

		getRSPOResults: function () {
			this._debug('Fetcher >>> getRSPOResults');
			var deferred = new Deferred();
			deferred.resolve(true);
			return deferred.promise;
		},

		// Main Query Calls Go Here

		_getTotalLossAnalysis: function (config, useSimpleEncoderRule) {
			this._debug('Fetcher >>> _getTotalLossAnalysis');
			var deferred = new Deferred(),
					lossConfig = ReportConfig.totalLoss,
					url = ReportConfig.imageServiceUrl,
					encoder = this._getEncodingFunction(lossConfig.bounds, config.bounds),
					renderingRule = useSimpleEncoderRule ? 
													encoder.getSimpleRule(lossConfig.rasterId, config.rasterId) : 
													encoder.render(lossConfig.rasterId, config.rasterId),
					content = {
						geometryType: 'esriGeometryPolygon',
						geometry: JSON.stringify(report.geometry),
						renderingRule: renderingRule,
						pixelSize: (report.geometry.rings.length > 45) ? 500: 100,
						f: 'json'
					},
					self = this;

			function success(response) {
				if (response.histograms.length > 0) {
					ReportRenderer.renderLossData(response.histograms[0].counts, config, encoder, useSimpleEncoderRule);
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
					}
				} else {
					deferred.resolve(false);
				}
			}

			// If the report analyzeTreeCoverLoss is false, just resolve here
			if (report.analyzeTreeCoverLoss) {
				this._computeHistogram(url, content, success, failure);
			} else {
				deferred.resolve(true);
			}

			return deferred.promise;
		},

		_getClearanceAlertAnalysis: function (config, useSimpleEncoderRule) {
			this._debug('Fetcher >>> _getClearanceAlertAnalysis');
			var deferred = new Deferred(),
					clearanceConfig = ReportConfig.clearanceAlerts,
					url = ReportConfig.imageServiceUrl,
					self = this,
					renderingRule,
					content,
					encoder;

			function success(response) {
				if (response.histograms.length > 0) {
					ReportRenderer.renderClearanceData(response.histograms[0].counts, config, encoder, useSimpleEncoderRule);
				} else {
					ReportRenderer.renderAsUnavailable('clearance', config);
				}
				deferred.resolve(true);
			}

			function failure(err) {
				deferred.resolve(false);
			}
			
			// If the report analyzeClearanceAlerts is false, just resolve here
			if (report.analyzeClearanceAlerts) {
				encoder = this._getEncodingFunction(report.clearanceBounds, config.bounds);
				renderingRule = useSimpleEncoderRule ? 
													encoder.getSimpleRule(clearanceConfig.rasterId, config.rasterId) : 
													encoder.render(clearanceConfig.rasterId, config.rasterId);
				content = {
					geometryType: 'esriGeometryPolygon',
					geometry: JSON.stringify(report.geometry),
					renderingRule: renderingRule,
					pixelSize: 500, // FORMA data has a pixel size of 500 so this must be 500 otherwise results will be off
					f: 'json'
				};
				this._computeHistogram(url, content, success, failure);
			} else {
				deferred.resolve(true);
			}

			return deferred.promise;
		},

		_getSuitabilityAnalysis: function () {
			this._debug('Fetcher >>> _getSuitabilityAnalysis');
			var deferred = new Deferred();
			deferred.resolve(true);
			return deferred.promise;
		},

		_getMillPointAnalysis: function () {
			this._debug('Fetcher >>> _getMillPointAnalysis');
			var deferred = new Deferred();
			deferred.resolve(true);
			return deferred.promise;
		},

		_getFireAlertAnalysis: function (config) {
			this._debug('Fetcher >>> _getFireAlertAnalysis');
			var deferred = new Deferred();
			deferred.resolve(true);
			return deferred.promise;
		},

		_getClearanceBounds: function () {
			this._debug('Fetcher >>> _getClearanceBounds');
			var config = ReportConfig.clearanceBounds,
					deferred = new Deferred(),
					incrementer = 0,
					month,
					req;

			if (report.analyzeClearanceAlerts) {
				req = esriRequest({
					url: config.url,
					content: {
						f: 'pjson'
					},
					handleAs: 'json',
					callbackParamName: 'callback'
				});

				req.then(function (res) {
					report.clearanceBounds = [res.minValues[0], res.maxValues[0]];
					report.clearanceLabels = [];
					for (var i = res.minValues[0], length = res.maxValues[0]; i <= length; i++) {
						month = i % 12 === 0 ? 12 : i % 12;
	      		report.clearanceLabels.push(month + "-" + (config.baseYearLabel + incrementer));
	      		if (i % 12 === 0) { ++incrementer; }
					}
					deferred.resolve(true);
				}, function (err) {
					deferred.resolve(false, err);
				});
			} else {
				deferred.resolve(true);
			}

			return deferred.promise;

		},

		_getEncodingFunction: function (arrayA, arrayB, options) {

			var self = this;

			return {
				A: arrayA.fromBounds(),
				B: arrayB.fromBounds(),
				getSimpleRule: function (id1, id2) {
					return JSON.stringify({
						'rasterFunction': 'Arithmetic',
						'rasterFunctionArguments': {
							'Raster': id1,
							'Raster2': id2,
							'Operation': 3
						}
					});
				},
				renderRule: function (id1, id2) {
					return {
						'rasterFunction': 'Arithmetic',
            'rasterFunctionArguments': {
              'Raster': {
                'rasterFunction': 'Arithmetic',
                'rasterFunctionArguments': {
                  'Raster': {
                    'rasterFunction': 'Remap',
                    'rasterFunctionArguments': {
                      'InputRanges': [this.A[0], (this.A[this.A.length-1]) + 1],
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
				render: function (id1, id2) {
					return JSON.stringify(this.renderRule(id1, id2));
				},
				encode: function (a, b) {
					// Get Unique Value for Two Input Values
					return this.B.length * a + b;
				},
				decode: function (value) {
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
		_computeHistogram: function (url, content, callback, errback) {
			var req = esriRequest({
				url: url + '/computeHistograms',
				content: content,
				handleAs: 'json',
				callbackParamName: 'callback',
				timeout: 60000
			}, { usePost: true });

			req.then(callback, errback);
		},

		/*
			Wrapper function for logging messages
		*/
		_debug: function (msg) {
			console.log(msg);
		}


	};

});