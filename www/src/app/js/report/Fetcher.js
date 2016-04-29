define([
		"lodash",
		"dojo/number",
		"dojo/Deferred",
		"dojo/promise/all",
		"dojo/_base/array",
		// My Modules
		"report/config",
		"report/Renderer",
		"report/RiskHelper",
		"report/Suitability",
		"map/Symbols",
		// esri modules
		"esri/map",
		"esri/request",
		"esri/tasks/query",
		"esri/dijit/Scalebar",
		"esri/tasks/QueryTask",
		"esri/SpatialReference",
		"esri/geometry/Polygon",
		"esri/geometry/Point",
		"esri/tasks/GeometryService",
		'esri/geometry/geometryEngine',
		"esri/tasks/AreasAndLengthsParameters",
		'esri/Color',
		'esri/symbols/SimpleFillSymbol',
		'esri/symbols/SimpleLineSymbol',
		'esri/symbols/SimpleMarkerSymbol',
		"esri/graphic",
		"report/rasterArea"
], function (_, dojoNumber, Deferred, all, arrayUtils, ReportConfig, ReportRenderer, RiskHelper, Suitability, Symbols, Map, esriRequest, Query, Scalebar, QueryTask, SpatialReference, Polygon, Point, GeometryService, geometryEngine, AreasAndLengthsParameters, Color, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Graphic, rasterArea) {
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
										deferred.resolve(area);
								} else {
										area = errorString;
										deferred.resolve(false);
								}
						}

						function failure(err) {
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

				setupMap: function () {
					console.log()
						var scalebar, graphic, poly, map;

						function mapLoaded () {
								map.graphics.clear();
								map.resize();

								scalebar = new Scalebar({
										map: map,
										scalebarUnit: 'metric'
								});

								// Simplify this as multiparts and others may not display properly
								poly = new Polygon(report.mapGeometry);
								graphic = new Graphic();
								graphic.setGeometry(poly);
								graphic.setSymbol(Symbols.getPolygonSymbol());

								if (report.centerPoints) {
									for (var j = 0; j < report.centerPoints.length; j++) {
										var pointGraphic = new Graphic();

										var pointSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 2,
											new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([255,0,0]), 1),
											new Color([0,0,0,0.25]));

										var pointGeom = new Point(report.centerPoints[j].geometry.x, report.centerPoints[j].geometry.y, report.centerPoints[j].geometry.spatialReference);

										pointGraphic.setGeometry(pointGeom);
										// pointGraphic.setSymbol(Symbols.getPointSymbol());
										pointGraphic.setSymbol(pointSymbol);

										map.graphics.add(pointGraphic);
									}
								}
								window.map = map

								map.graphics.add(graphic);
								map.setExtent(graphic.geometry.getExtent().expand(3), true);
						}

						map = new Map('print-map', {
								basemap: 'topo',
								sliderPosition: "top-right"
						});

						if (map.loaded) {
							mapLoaded();
						} else {
							map.on('load', mapLoaded);
						}

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
								this._getClearanceAlertAnalysis(config),
								this._getCompositionAnalysis(config)
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
										pixelSize: ReportConfig.pixelSize,
										f: 'json'
								},
								self = this;

						// Create the container for all the result
						ReportRenderer.renderTotalLossContainer(config);
						ReportRenderer.renderCompositionAnalysisLoader(config);

						function success(response) {
								if (response.histograms.length > 0) {
										ReportRenderer.renderTreeCoverLossData(response.histograms[0].counts, content.pixelSize, config);
										ReportRenderer.renderCompositionAnalysis(response.histograms[0].counts, content.pixelSize, config);
								} else {
										ReportRenderer.renderAsUnavailable('loss', config);
								}
								deferred.resolve(true);
						}

						function failure(error) {
								var newFailure = function(error){
									deferred.resolve(false);
								}
								if (error.details) {
										if (error.details[0] === 'The requested image exceeds the size limit.' && content.pixelSize !== 500) {
												content.pixelSize = 500;
												self._computeHistogram(url, content, success, failure);
										} else if (error.details.length === 0) {
												var maxDeviation = 10;
												content.geometry = JSON.stringify(geometryEngine.generalize(report.geometry, maxDeviation, true, 'miles'));
												self._computeHistogram(url, content, success, newFailure);
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

				getProdesResults: function() {
						this._debug('Fetcher >>> getProdesResults');
						var deferred = new Deferred(),
								config = ReportConfig.prodes,
								url = ReportConfig.imageServiceUrl,
								content = {
										geometryType: 'esriGeometryPolygon',
										geometry: JSON.stringify(report.geometry),
										mosaicRule: JSON.stringify(config.mosaicRule),
										pixelSize: ReportConfig.pixelSize,
										f: 'json'
								},
								self = this;

						// Create the container for all the result
						ReportRenderer.renderProdesContainer(config);
						ReportRenderer.renderCompositionAnalysisLoader(config);

						function success(response) {
								if (response.histograms.length > 0) {
										ReportRenderer.renderProdesData(response.histograms[0].counts, content.pixelSize, config);
										ReportRenderer.renderCompositionAnalysis(response.histograms[0].counts, content.pixelSize, config);
								} else {
										ReportRenderer.renderAsUnavailable('prodes', config);
								}
								deferred.resolve(true);
						}

						function failure(error) {
								var newFailure = function(error){
									deferred.resolve(false);
								}
								if (error.details) {
										if (error.details[0] === 'The requested image exceeds the size limit.' && content.pixelSize !== 500) {
												content.pixelSize = 500;
												self._computeHistogram(url, content, success, failure);
										} else if (error.details.length === 0) {
												var maxDeviation = 10;
												content.geometry = JSON.stringify(geometryEngine.generalize(report.geometry, maxDeviation, true, 'miles'));
												self._computeHistogram(url, content, success, newFailure);
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

				getIndonesiaMoratoriumResults: function () {
						this._debug('Fetcher >>> getIndonesiaMoratoriumResults');
						var deferred = new Deferred(),
								config = ReportConfig.indonesiaMoratorium;

						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						// true below as 2nd param means use simplified rendering rule, encoder.getSimpleRule
						all([
								this._getTotalLossAnalysis(config, true),
								this._getClearanceAlertAnalysis(config, true),
								this._getCompositionAnalysis(config)
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
								this._getClearanceAlertAnalysis(config, true),
								this._getCompositionAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getCarbonStocksResults: function() {
						this._debug('Fetcher >>> getCarbonStocksResults');
						var deferred = new Deferred(),
								config = ReportConfig.carbonStock;
								console.dir(config)
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



        getPlantationsSpeciesResults: function() {
						this._debug('Fetcher >>> getPlantationsSpeciesResults');
						var deferred = new Deferred(),
								config = ReportConfig.plantationsSpeciesLayer;
								console.dir(config);
						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						all([
								this._getTotalLossAnalysis(config)
								// this._getClearanceAlertAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

        getPlantationsTypeResults: function() {
						this._debug('Fetcher >>> getPlantationsTypeResults');
						var deferred = new Deferred(),
								config = ReportConfig.plantationsTypeLayer;
								console.dir(config);
						// Create the container for all the results
						// Add this config to Fires so the Fires request knows to add data here
						ReportRenderer.renderContainers(config);
						_fireQueriesToRender.push(config);

						all([
								this._getTotalLossAnalysis(config)
								// this._getClearanceAlertAnalysis(config)
						]).then(function() {
								deferred.resolve(true);
						});

						return deferred.promise;
				},

				getBrazilBiomesResults: function() {
						this._debug('Fetcher >>> getBrazilBiomesResults');
						var deferred = new Deferred(),
								config = ReportConfig.brazilBiomes;
								console.dir(config)
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
								this._getClearanceAlertAnalysis(config, true),
								this._getCompositionAnalysis(config)
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
										pixelSize: ReportConfig.pixelSize,
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
										pixelSize: ReportConfig.pixelSize,
										f: 'json'
								},
								self = this;

						function success(response) {
								if (response.histograms.length > 0) {
										ReportRenderer.renderLossData(response.histograms[0].counts, content.pixelSize, config, encoder, useSimpleEncoderRule);
								} else {
										// Add some dummy 0's
										var zerosArray = Array.apply(null, new Array(lossConfig.labels.length)).map(Number.prototype.valueOf, 0);
										ReportRenderer.renderLossData(zerosArray, content.pixelSize, config, encoder, useSimpleEncoderRule);
										//ReportRenderer.renderAsUnavailable('loss', config);
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

						config = _.clone(config);

						function success(response) {
								if (response.histograms.length > 0) {
										ReportRenderer.renderClearanceData(response.histograms[0].counts, content.pixelSize, config, encoder, useSimpleEncoderRule);
								} else {
										// Add some dummy 0's
										var zerosArray = Array.apply(null, new Array(report.clearanceLabels.length)).map(Number.prototype.valueOf, 0);
										ReportRenderer.renderClearanceData(zerosArray, content.pixelSize, config, encoder, useSimpleEncoderRule);
										//ReportRenderer.renderAsUnavailable('clearance', config);
								}
								deferred.resolve(true);
						}

						function failure(error) {
							var newFailure = function(){
								deferred.resolve(false);
							};
							if (error.details) {
									if (error.details[0] === 'Invalid cell size') {

											var polys = [];

											// var unionedGeom;
											// debugger

											// var unionedGeom = new Polygon(report.geometry.rings[0], new SpatialReference(54012));

											// for (var j = 1; j < report.geometry.rings.length; j++) {
											//   // var poly = new Polygon(report.geometry.rings[j], new SpatialReference(54012));
											//   //
											//   // var intersects = geometryEngine.intersects(unionedGeom, poly);
											//   // if (intersects === false) {
											//   //     unionedGeom = geometryEngine.union([unionedGeom, poly]);
											//   // }
											//
											//
											//   // polys.push(poly);
											//   polys.concat(report.geometry.rings[j]);
											// }

											arrayUtils.forEach(report.geometry.rings, function (ring) {
												if (ring) {
													polys = polys.concat(ring);
												}
											});

											var poly = new Polygon(polys);
											// report.geometry = geometryEngine.simplify(poly);
											// report.geometry = geometryEngine.union(polys);
											// report.geometry = unionedGeom;
											console.log(report.geometry)

											report.mapGeometry = poly;

											content.geometry = JSON.stringify(report.geometry);


											self._computeHistogram(url, content, success, newFailure);
									} else {
											deferred.resolve(false);
									}
							} else {
									deferred.resolve(false);
							}
								// deferred.resolve(false);
						}

						/*
						* Some layers have special ids that need to be overwritten from the config becuase
						* the config powers multiple charts and the clearance alerts analysis is the onlyone that
						* uses a different value, if more layers need this, give them a 'formaId' in report/config.js
						*/
						if (config.formaId) {
								config.rasterId = config.formaId;
								if (config.includeFormaIdInRemap) {
										config.rasterRemap.rasterFunctionArguments.Raster = config.formaId;
								}
						}

						encoder = this._getEncodingFunction(report.clearanceBounds, config.bounds);
						rasterId = config.rasterRemap ? config.rasterRemap : config.rasterId;
						renderingRule = useSimpleEncoderRule ?
								encoder.getSimpleRule(clearanceConfig.rasterId, rasterId) :
								encoder.render(clearanceConfig.rasterId, rasterId);
						console.log('renderingRule', renderingRule);
						// report.geometry.rings = [report.geometry.rings[report.geometry.rings.length - 1]];
						content = {
								geometryType: 'esriGeometryPolygon',
								geometry: JSON.stringify(report.geometry),
								renderingRule: renderingRule,
								pixelSize: 500, // FORMA data has a pixel size of 500 so this must be 500 otherwise results will be off
								f: 'json'
						};

						// content.geometry = JSON.stringify(geometryEngine.generalize(report.geometry, 1000, true, 'miles'));
						// content.geometry = geometryEngine.simplify(content.geometry);

						this._computeHistogram(url, content, success, failure);

						return deferred.promise;
				},

				getGladResults: function(config, useSimpleEncoderRule) {
						this._debug('Fetcher >>> getGladResults');
						var deferred = new Deferred(),
								gladConfig = ReportConfig.gladLayer, //ReportConfig.clearanceAlerts,
								url = ReportConfig.glad.url,
								self = this,
								content,
								encoder;

								console.log(url);


						config = _.clone(config);

						function success(response) {
							console.log('GLAD success');
								if (response.histograms.length > 0) {
										ReportRenderer.renderGladData(response.histograms[0].counts, content.pixelSize, config, encoder, useSimpleEncoderRule);
								} else {
									console.log('GLAD failurrre');
										// Add some dummy 0's
										var zerosArray = Array.apply(null, new Array(report.clearanceLabels.length)).map(Number.prototype.valueOf, 0);
										ReportRenderer.renderGladData(zerosArray, content.pixelSize, config, encoder, useSimpleEncoderRule);
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

						content = {
								geometryType: 'esriGeometryPolygon',
								geometry: JSON.stringify(report.geometry),
								// renderingRule: renderingRule,
								pixelSize: 30,
								f: 'json'
						};
						console.log('url', url);
						console.log(content);
						debugger

						this._computeHistogram(url, content, success, failure);

						return deferred.promise;
				},

				_getCompositionAnalysis: function(config) {

						// var simpleRule = {
						//   "rasterFunction": "Remap",
						//   "rasterFunctionArguments": {
						//       "InputRanges": [1, 3],
						//       "OutputValues": [1],
						//       "Raster": config.rasterId,
						//       "AllowUnmatched": false
						//   }
						// };

						// var layerConfig = {
						//   simpleRule: simpleRule
						// };

						// rasterArea.getArea(report.geometry, layerConfig).then(function (data) {

						// });

						ReportRenderer.renderCompositionAnalysisLoader(config);

						var deferred = new Deferred(),
								url = ReportConfig.imageServiceUrl,
								compositionConfig = config.compositionAnalysis,
								content = {
										geometryType: 'esriGeometryPolygon',
										geometry: JSON.stringify(report.geometry),
										mosaicRule: JSON.stringify({
												'mosaicMethod': 'esriMosaicLockRaster',
												'lockRasterIds': [compositionConfig.rasterId],
												'ascending': true,
												'mosaicOperation': 'MT_FIRST'
										}),
										pixelSize: ReportConfig.pixelSize,
										f: 'json'
								},
								self = this;

						function success(response) {

								if (response.histograms.length > 0) {
										ReportRenderer.renderCompositionAnalysis(response.histograms[0].counts, content.pixelSize, config);
								} else {
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
								Suitability.getCompositionAnalysis().then(function (results) {
										ReportRenderer.renderSuitabilityCompositionChart(results);
										deferred.resolve(true);
								});
						});

						return deferred.promise;
				},

				_getMillPointAnalysis: function() {

						this._debug('Fetcher >>> _getMillPointAnalysis');
						var deferred = new Deferred(),
								config = ReportConfig.millPoints,
								customDeferred = new Deferred(),
								knownDeferred = new Deferred(),
								customMills = [],
								knownMills = [];

						// Create the container for the results
						ReportRenderer.renderMillContainer(config);

						// Create two separate lists of mills
						arrayUtils.forEach(report.mills, function (mill) {
							if (mill.isCustom) {
								customMills.push(mill);
							} else {
								knownMills.push(mill);
							}
						});

						// if the mill points are from the known mills list, use GFW's API
						if (knownMills.length > 0) {
							getKnownMillsResults();
						} else {
							knownDeferred.resolve();
						}

						// If the mill points are custom, use our API, our API requires a bit more pre processing since
						// the geometry being analyzed is custom and of various sizes
						if (customMills.length > 0) {
							getCustomMillsResults();
						} else {
							customDeferred.resolve(false);
						}

						function getKnownMillsResults () {
							var request = new XMLHttpRequest(), response;

							request.open('POST', config.url, true);
							request.onreadystatechange = function (res) {
								if (request.readyState === 4) {
									if (request.status === 200) {
										response = JSON.parse(request.response);
										if (response.mills) {
											// ReportRenderer.renderMillAssessment(response.mills, config);
											knownDeferred.resolve(response.mills);
										} else {
											knownDeferred.resolve(false);
										}
									} else {
										knownDeferred.resolve(false);
									}
								}
							};

							request.addEventListener('error', function () {
								knownDeferred.resolve(false);
							}, false);

							var formData = new FormData();
							formData.append('mills', knownMills.map(function (mill) { return mill.millId; }).join(','));
							// Construct the POST Content in HERE for each Mill
							request.send(formData);

						}

						function getCustomMillsResults () {
							RiskHelper.prepareFeatures(customMills).then(function (millObjects) {
								customDeferred.resolve(millObjects);
							});
						}

						all([customDeferred, knownDeferred]).then(function (results) {
							// Merge the Results, then Render them
							var mills = [];
							arrayUtils.forEach(results, function (millResult) {
								if (millResult) {
									mills = mills.concat(millResult);
								}
							});

							ReportRenderer.renderMillAssessment(mills, config);
							deferred.resolve(true);
						});

						return deferred.promise;
				},

				_getFireAlertAnalysis: function() {
						this._debug('Fetcher >>> _getFireAlertAnalysis');
						var deferred = new Deferred(),
								polygon = new Polygon(report.geometry),
								time = new Date(),
								dateString = "",
								errorCount = 0,
								self = this,
								defs = [],
								params2,
								params1,
								task2,
								task1;

						params1 = new Query();
						task1 = new QueryTask(ReportConfig.fires.url + "/4");
						params1.geometry = polygon;
						params1.returnGeometry = false;
						params1.outFields = ["*"];
						params1.where = "1 = 1";


						// This query is only temporary until moratorium data is added to the main layer above
						// This needs to be addressed so this code can be removed
						task2 = new QueryTask("http://gis-potico.wri.org/arcgis/rest/services/Fires/FIRMS_ASEAN/MapServer/0");
						params2 = new Query();
						params2.geometry = polygon;
						params2.returnGeometry = false;
						params2.outFields = ["moratorium"];
						time.setDate(time.getDate() - 8);
						dateString = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" +
								time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
						params2.where = "ACQ_DATE > date '" + dateString + "'";

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

						// task2.on('error', function() {
						//     deferred.resolve(false);
						// });

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

								// For the meantime, we need to slice the first 12 values out to remove 2013 years from this
								// When the new service gets min and max values set so that I can get the bounds from there
								// report.clearanceBounds[0] = 13;
								// report.clearanceLabels = report.clearanceLabels.slice(12);

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
								A: arrayFromBounds(arrayA),
								B: arrayFromBounds(arrayB),
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
						console.log(msg);
				}


		};

});
