define([
	// Esri Modules
	"esri/request",
	"esri/tasks/query",
	"esri/tasks/QueryTask",
	"esri/geometry/Polygon",
	// My Modules
	"report/config",
	// Dojo Modules
	"dojo/Deferred",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/promise/all"
], function (esriRequest, Query, QueryTask, Polygon, ReportConfig, Deferred, lang, arrayUtils, all) {	

	return {

		getSuitabilityData: function () {
			var deferred = new Deferred(),
					self = this;

			function complete(data) {
				deferred.resolve(data);
			}

			all([
				this.getSuitableAreas(),
				this.getLCHistogramData(),
				this.getRoadData(),
				this.getConcessionData(),
				this.computeLegalHistogram()
			]).then(complete);

			return deferred.promise;
		},

		getSuitableAreas: function (pixelSize) {
			var deferred = new Deferred(),
					renderRule = lang.clone(report.suitable.renderRule),
					url = ReportConfig.suitability.url,
					self = this,
					params = {
						f: 'json',
						pixelSize: 100,
						geometryType: ReportConfig.suitability.geometryType,
						geometry: JSON.stringify(report.geometry)
					},
					payload = {};

			renderRule.rasterFunction = ReportConfig.suitability.rasterFunction;
			params.renderingRule = JSON.stringify(renderRule);

			function success(res) {
				if (res.histograms.length > 0) {
					payload.data = res.histograms[0];
					payload.pixelSize = params.pixelSize;
					deferred.resolve(payload);
				} else {
					deferred.resolve(false);
				}
			}

			function failure(err) {
				if (err.details) {
					if (err.details[0] === 'The requested image exceeds the size limit.' && params.pixelSize !== 500) {
						params.pixelSize = 500;
						self.getHistogram(url, params, success, failure);
					} else {
						deferred.resolve(false);
					}
				} else {
					deferred.resolve(false);
				}
			}

			this.getHistogram(url, params, success, failure);
			return deferred.promise;
		},

		getLCHistogramData: function () {
			var deferred = new Deferred(),
					config = ReportConfig.suitability.lcHistogram,
					renderRule = config.renderRule,
					url = ReportConfig.suitability.url,
					self = this,
					params = {
						f: 'json',
						pixelSize: 100,
						geometryType: ReportConfig.suitability.geometryType,
						geometry: JSON.stringify(report.geometry),
						renderingRule: JSON.stringify(renderRule)
					},
					payload = {};

			function success(res) {
				if (res.histograms.length > 0) {
					payload.data = res.histograms[0];
					payload.pixelSize = params.pixelSize;
					deferred.resolve(payload);
				} else {
					deferred.resolve(false);
				}
			}

			function failure(err) {
				if (err.details) {
					if (err.details[0] === 'The requested image exceeds the size limit.' && params.pixelSize !== 500) {
						params.pixelSize = 500;
						self.getHistogram(url, params, success, failure);
					} else {
						deferred.resolve(false);
					}
				} else {
					deferred.resolve(false);
				}
			}

			this.getHistogram(url, params, success, failure);
			return deferred.promise;
		},

		getRoadData: function () {
			var deferred = new Deferred(),
					config = ReportConfig.suitability.roadHisto,
					url = ReportConfig.suitability.url,
					mosaicRule = config.mosaicRule,
					self = this,
					params = {
						f: 'json',
						pixelSize: 100,
						geometryType: ReportConfig.suitability.geometryType,
						geometry: JSON.stringify(report.geometry),
						mosaicRule: JSON.stringify(mosaicRule)
					},
					payload = {};

			function success(res) {
				if (res.histograms.length > 0) {
					payload.data = res.histograms[0];
					payload.pixelSize = params.pixelSize;
					deferred.resolve(payload);
				} else {
					deferred.resolve(false);
				}
			}

			function failure(err) {
				if (err.details) {
					if (err.details[0] === 'The requested image exceeds the size limit.' && params.pixelSize !== 500) {
						params.pixelSize = 500;
						self.getHistogram(url, params, success, failure);
					} else {
						deferred.resolve(false);
					}
				} else {
					deferred.resolve(false);
				}
			}

			this.getHistogram(url, params, success, failure);
			return deferred.promise;
		},

		getConcessionData: function () {
			var deferred = new Deferred(),
					config = ReportConfig.suitability.concessions,
					query = new Query(),
					queryTask = new QueryTask(config.url + "/" + config.layer);

			query.returnGeometry = false;
			query.geometry = new Polygon(report.geometry);
			queryTask.executeForCount(query, function (count) {
				deferred.resolve({
					value: (count > 0) ? 'Yes' : 'No'
				});
			}, function (err) {
				deferred.resolve(false);
			});

			return deferred.promise;
		},

		computeLegalHistogram: function () {
			var deferred = new Deferred(),
					suitRenderRule = lang.clone(report.suitable.renderRule),
					config = ReportConfig.suitability.lcHistogram,
					targetRule = config.renderRuleSuitable,
					url = ReportConfig.suitability.url,
					self = this,
					params = {
						f: 'json',
						pixelSize: 100,
						geometryType: ReportConfig.suitability.geometryType,
						geometry: JSON.stringify(report.geometry)
					},
					payload = {};

			lang.mixin(suitRenderRule.rasterFunctionArguments, targetRule.rasterFunctionArguments);
			suitRenderRule.rasterFunction = targetRule.rasterFunction;
			params.renderingRule = JSON.stringify(suitRenderRule);

			function success(res) {
				if (res.histograms.length > 0) {
					payload.data = res.histograms[0];
					payload.pixelSize = params.pixelSize;
					deferred.resolve(payload);
				} else {
					deferred.resolve(false);
				}
			}

			function failure(err) {
				if (err.details) {
					if (err.details[0] === 'The requested image exceeds the size limit.' && params.pixelSize !== 500) {
						params.pixelSize = 500;
						self.getHistogram(url, params, success, failure);
					} else {
						deferred.resolve(false);
					}
				} else {
					deferred.resolve(false);
				}
			}

			this.getHistogram(url, params, success, failure);
			return deferred.promise;
		},

		getCompositionAnalysis: function () {

			var deferred = new Deferred(),
					cumulativeResults = [],
					self = this;

			all([
				self.getElevationComposition(),
				self.getSlopeComposition(),
				self.getWaterComposition(),
				self.getConservationComposition(),
			]).then(function (firstResults) {

				all([
					self.getSoilTypeComposition(),
					self.getSoilDepthComposition(),
					self.getPeatComposition(),
					self.getSoilAcidityComposition()
				]).then(function (secondResults) {

					all([
						self.getSoilDrainComposition(),
						self.getRainfallComposition(),
						self.getLandCoverComposition()
					]).then(function (thirdResults) {
						// Concatenate the results into a single array of objects
						deferred.resolve(firstResults.concat(secondResults.concat(thirdResults)));
					});

				});

			});

			return deferred.promise;

		},

		getElevationComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$1', 'ElevInpR', 'ElevOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Elevation");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getSlopeComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$2', 'SlopeInpR', 'SlopeOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Slope");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getWaterComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$3', 'WaterInpR', 'WaterOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Water Resource Buffers");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getConservationComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$4', 'ConsInpR', 'ConsOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Conservation Area Buffers");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getSoilTypeComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$5', 'STypeInpR', 'STypeOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Soil Type");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getSoilDepthComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$6', 'SDepthInpR', 'SDepthOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Soil Depth");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getPeatComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$7', 'PeatInpR', 'PeatOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Peat Depth");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getSoilAcidityComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$8', 'SAcidInpR', 'SAcidOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Soil Acidity");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getSoilDrainComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$9', 'SDrainInpR', 'SDrainOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Soil Drainage");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getRainfallComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$10', 'RainfallInpR', 'RainfallOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Rainfall");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getLandCoverComposition: function () {
			var deferred = new Deferred(),
				self = this,
				renderRule,
				suitableIndex,
				data;

			renderRule = this.getCompositionRemapRule('$11', 'LCInpR', 'LCOutV');

			this.queryComposition(renderRule, function (results) {
				data = self.formatCompositionResults(results, "Land Cover");
				deferred.resolve(data);
			});
			return deferred.promise;
		},

		getCompositionRemapRule: function (rasterId, argsKeyIn, argsKeyOut) {

			var renderingRule = lang.clone(report.suitable.renderRule);

			return {
				"rasterFunction": "Remap",
				"rasterFunctionArguments": {
					"InputRanges": renderingRule.rasterFunctionArguments[argsKeyIn],
					"OutputValues": renderingRule.rasterFunctionArguments[argsKeyOut],
					"Raster": rasterId
				},
				"outputPixelType": "U2"
			};
		},

		// getCompositionRenderingRule: function (rasterId) {
		// 	var renderingRule = {},
		// 			suitabilityRule = lang.clone(report.suitable.renderRule);

		// 	// Wrap the suitability rule in an arithmetic rendering rule and apply the correct rasterId
		// 	renderingRule.rasterFunction = 'Arithmetic';
		// 	// Update the raster function on the suitability rule
		// 	suitabilityRule.rasterFunction = 'PalmOilSuitability_Histogram';

		// 	renderingRule.rasterFunctionArguments = {
		// 		"Raster": suitabilityRule,
		// 		"Raster2": rasterId,
		// 		"AllowUnmatched": false,
		// 		"Operation": 3
		// 	};
		// 	return renderingRule;
		// },

		// getFloatingPointCompositionRenderingRule: function (rasterId, argumentsKeyIn, argumentsKeyOut) {
		// 	var renderingRule = {},
		// 			suitabilityRule = lang.clone(report.suitable.renderRule);

		// 	// Wrap the suitability rule in an arithmetic rendering rule and apply the correct rasterId
		// 	renderingRule.rasterFunction = 'Arithmetic';
		// 	// Update the raster function on the suitability rule
		// 	suitabilityRule.rasterFunction = 'PalmOilSuitability_Histogram';

		// 	renderingRule.rasterFunctionArguments = {
		// 		"Raster": suitabilityRule,
		// 		"Raster2": {
		// 			"rasterFunction": "Remap",
		// 			"rasterFunctionArguments": {
		// 				"InputRanges": suitabilityRule.rasterFunctionArguments[argumentsKeyIn],
		// 				"OutputValues": suitabilityRule.rasterFunctionArguments[argumentsKeyOut],
		// 				"Raster": rasterId
		// 			},
		// 			"outputPixelType": "U2"
		// 		},
		// 		"Operation": 3
		// 	};
		// 	return renderingRule;
		// },

		queryComposition: function (renderingRule, callback) {
			var url = ReportConfig.suitability.url,
					params = {
						f: 'json',
						pixelSize: 100,
						geometryType: ReportConfig.suitability.geometryType,
						geometry: JSON.stringify(report.geometry),
						renderingRule: JSON.stringify(renderingRule)
					},
					data;

			function success(res) {
				var data;

				if (res.histograms.length > 0) {
					data = res.histograms[0] && res.histograms[0].counts || [0, 0];
					callback(data);
				} else {
					data = [0,0];
					callback(data);
				}
			}

			function failure(err) {
				if (err.details) {
					if (err.details[0] === 'The requested image exceeds the size limit.' && params.pixelSize !== 500) {
						params.pixelSize = 500;
						self.getHistogram(url, params, success, failure);
					} else {
						callback(false);
					}
				} else {
					callback(false);
				}
			}

			this.getHistogram(url, params, success, failure);

		},

		/**
		* @param {array} data - histogram counts
		# @param {string} labelForChart - Label for Chart
		*/
		formatCompositionResults: function (data, labelForChart) {
			return {
				unsuitable: data[0] || 0,
				suitable: data[1] || 0,
				label: labelForChart
			};
		},

		getHistogram: function (url, content, callback, errback) {
			
			var req = esriRequest({
				url: url + "/computeHistograms?",
				content: content,
				handleAs: "json",
				callbackParamName: "callback"
			});
			
			req.then(callback, errback);

		}

	};

});