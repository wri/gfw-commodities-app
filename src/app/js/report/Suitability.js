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
	"dojo/promise/all"
], function (esriRequest, Query, QueryTask, Polygon, ReportConfig, Deferred, lang, all) {	

	return {

		getSuitabilityData: function () {
			var deferred = new Deferred();

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
					renderRule = report.suitable.renderRule,
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
						mosaicRule: mosaicRule
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
					suitRenderRule = report.suitable.renderRule,
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