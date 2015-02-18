define([
	"report/config",
	"dojo/number",
	"dijit/Dialog",
	"dojo/_base/array",
    "dojo/on",
    "dojo/dom",
    "dojo/dom-style"
], function (ReportConfig, number, Dialog, arrayUtils, on, dom, domStyle) {
	'use strict';

	// Container IDS for charts and tables are as Follows
	// config.rootNode + '_loss'
	// config.rootNode + '_clearance'
	// config.rootNode + '_fire'
	// config.rootNode + '_mill'
	// Suitability Analysis
	// config.rootNode + '_content'
	// config.rootNode + '_chart'

	return {

		/*
			@param {object} config
		*/
		renderContainers: function (config) {
			var fragment = document.createDocumentFragment(),
					node = document.createElement('div');

			node.id = config.rootNode;
			node.className = "result-container";
			node.innerHTML = "<div class='title'>" + config.title + "</div>" +
					"<div class='result-block total-loss'>" +
						"<div class='top-panel' id='" + config.rootNode + "_composition'></div>" +
						"<div class='left-panel'>" +
							"<div class='loss-chart' id='" + config.rootNode + "_loss'><div class='loader-wheel'>total loss</div></div>" +
						"</div>" +
						"<div class='right-panel'>" +
							"<div class='fires-chart' id='" + config.rootNode + "_fire'><div class='loader-wheel'>active fires</div></div>" +
						"</div>" +
					"</div>" +
					"<div class='result-block clearance-alerts'>" +
						"<div class='clearance-chart' id='" + config.rootNode + "_clearance'><div class='loader-wheel'>clearance alerts</div></div>" +
					"</div>" +
					"<div class='result-block mill-points'>" +
						"<div class='mill-table' id='" + config.rootNode + "_mill'></div>" +
					"</div>";

			// Append root to fragment and then fragment to document
			fragment.appendChild(node);
			document.getElementById('report-results-section').appendChild(fragment);
		},

		/*
			@param {object} config
		*/
		renderTotalLossContainer: function (config) {
			var fragment = document.createDocumentFragment(),
					node = document.createElement('div');

			node.id = config.rootNode;
			node.className = "result-container";
			node.innerHTML = "<div class='title'>" + config.title + "</div>" +
					"<div class='result-block total-loss'>" +
						"<div class='top-panel' id='" + config.rootNode + "_composition'></div>" +
						"<div class='left-panel'>" +
							"<div class='loss-chart' id='" + config.rootNode + "_loss'><div class='loader-wheel'>total loss</div></div>" +
						"</div>" +
					"</div>";

			// Append root to fragment and then fragment to document
			fragment.appendChild(node);
			document.getElementById('report-results-section').appendChild(fragment);
		},

		/*
			@param {object} config
		*/
		renderRSPOContainer: function (config) {
			var fragment = document.createDocumentFragment(),
					node = document.createElement('div');

			node.id = config.rootNode;
			node.className = "result-container";
			node.innerHTML = "<div class='title'>" + config.title + "</div>" +
					"<div class='rspo-table-container' id='" + config.rootNode + "_table'><div class='loader-wheel'>rspo analysis</div></div>" + 
					"<div class='rspo-chart-container' id='" + config.rootNode + "_chart'></div>";

			// Append root to fragment and then fragment to document
			fragment.appendChild(node);
			document.getElementById('report-results-section').appendChild(fragment);

		},

		/*
			@param {object} config
		*/
		renderSuitabilityContainer: function (config) {
			var fragment = document.createDocumentFragment(),
					node = document.createElement('div');

			node.id = config.rootNode;
			node.className = "result-container";
			node.innerHTML = "<div class='title'>" + config.title + "</div>" +
					"<div class='suitability-container'>" +
						"<div class='left-panel'>" +
							"<div id='" + config.rootNode + "_content' class='suitability-content'><div class='loader-wheel'>suitability</div></div>" +
						"</div>" +
						"<div class='right-panel'>" +
							"<div id='" + config.rootNode + "_chart' class='suitability-chart'><div class='loader-wheel'>suitability</div></div>" +
						"</div>" +
					"</div>";

			// Append root to fragment and then fragment to document
			fragment.appendChild(node);
			document.getElementById('report-results-section').appendChild(fragment);
		},

		/*
			@param {object} config
		*/
		renderMillContainer: function (config) {
			var fragment = document.createDocumentFragment(),
					node = document.createElement('div');

			node.id = config.rootNode;
			node.className = "result-container relative";
			node.innerHTML = "<div class='title'>" + config.title + "</div>" +
					"<div class='mill-table-container' id='" + config.rootNode + "_table'><div class='loader-wheel'>risk assessment</div></div>";

			// Append root to fragment and then fragment to document
			fragment.appendChild(node);
			document.getElementById('report-results-section').appendChild(fragment);
		},

		renderCompositionAnalysisLoader: function(config) {
			document.getElementById(config.rootNode + '_composition').innerHTML = '<div class="loader-wheel">composition analysis</div>';
		},

		renderCompositionAnalysis: function (histogramData, pixelSize, config) {
			var fragment = document.createDocumentFragment(),
					node = document.createElement('div'),
					dest = document.getElementById(config.rootNode + '_composition'),
					compositionConfig = config.compositionAnalysis,
					title = compositionConfig.title || config.title,
					areaLabel,
					percentage,
					area;
					
			if (compositionConfig.histogramSlice) {
				area = histogramData.slice(compositionConfig.histogramSlice);
			}

			area = (area.reduce(function(a,b){return a + b;}) * pixelSize * pixelSize)/10000;
			areaLabel = number.format(area);

			report.areaPromise.then(function(){

				percentage = number.format((area/report.area)*100, {places: 0});

				node.className = "composition-analysis-container";
				node.innerHTML = 	"<div>Total " + title + " in selected area: " + areaLabel + " ha</div>" +
													"<div>Percent of total area comprised of " + title + ": " + percentage + "%</div>";

				// Append root to fragment and then fragment to document
				fragment.appendChild(node);
				dest.innerHTML = "";
				dest.appendChild(fragment);
				
			});
		},

		/*
			@param {array} histogramData
			@param {number} pixelSize
			@param {object} config
			@param {function} encoder
			@param {boolean} useSimpleEncoderRule
		*/
		renderLossData: function (histogramData, pixelSize, config, encoder, useSimpleEncoderRule) {
			var lossConfig = ReportConfig.totalLoss,
					yLabels = config.labels,
					xLabels = lossConfig.labels,
					yMapValues = config.bounds.fromBounds(),
					xMapValues = lossConfig.bounds.fromBounds(),
					mapFunction = function(item){return (item*pixelSize*pixelSize)/10000; },
					series = [],
					colors = [],
					location,
					sliceIndex,
					data,
					i, j;

			if (useSimpleEncoderRule) {
				series.push({
					'name': yLabels[0],
					'data': histogramData.slice(1).map(mapFunction) // Remove first value as that is all the 0 values we dont want
				});
				colors.push(config.colors[0]);
			} else {
				for (i = 0; i < yMapValues.length; i++) {
					data = [];
					for (j = 0; j < xMapValues.length; j++) {
						// Get location from encoder
						location = encoder.encode(xMapValues[j], yMapValues[i]);
						data.push(histogramData[location] || 0);
					}
					series.push({
						'name': yLabels[i],
						'data': data.map(mapFunction)
					});
					colors.push(config.colors[i]);
				}
			}

			// Format the data based on some config value, removeBelowYear
			// get index of removeBelowYear and use that to splice the data arrays and the xlabels
			if (config.lossChart.removeBelowYear) {
				sliceIndex = xLabels.indexOf(config.lossChart.removeBelowYear);
				xLabels = xLabels.slice(sliceIndex);
				arrayUtils.forEach(series, function (serie) {
					serie.data = serie.data.slice(sliceIndex);
				});
			}

			$("#" + config.rootNode + '_loss').highcharts({
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: null,
					type: 'bar',
					events: {
						load: function () {
							// $('#' + config.tclChart.container + " .highcharts-legend").appendTo('#' + config.tclChart.container + "-legend");
							// this.setSize(300, 400);
						}
					}
				},
				colors: colors,
				title: {
					text: config.lossChart.title
				},
				xAxis: {
					categories: xLabels,
					maxPadding: 0.35,
					title: {
						text: null
					}
				},
				yAxis: {
					stackLabels: {
						enabled: true
					},
					title: {
						text: null
					}
				},
				legend: {
					enabled: true,
					verticalAlign: 'bottom'
				},
				plotOptions: {
					series: {
						stacking: 'normal'
					}
				},
				series: series,
				credits: {
					enabled: false
				}
			});

		},


		/*
			@param {array} histogramData
			@param {number} pixelSize
			@param {object} config
		*/
		renderTreeCoverLossData: function (histogramData, pixelSize, config) {

			var lossConfig = ReportConfig.totalLoss,
					yLabels = config.labels,
					xLabels = lossConfig.labels,
					yMapValues = config.bounds.fromBounds(),
					xMapValues = lossConfig.bounds.fromBounds(),
					mapFunction = function(item){return (item*pixelSize*pixelSize)/10000; },
					series = [],
					colors = [],
					location,
					sliceIndex,
					data,
					i, j;

			series.push({
				'name': yLabels[0],
				'data': histogramData.slice(1).map(mapFunction) // Remove first value as that is all the 0 values we dont want
			});
			colors.push(config.color);

			// Format the data based on some config value, removeBelowYear
			// get index of removeBelowYear and use that to splice the data arrays and the xlabels
			if (config.lossChart.removeBelowYear) {
				sliceIndex = xLabels.indexOf(config.lossChart.removeBelowYear);
				xLabels = xLabels.slice(sliceIndex);
				arrayUtils.forEach(series, function (serie) {
					serie.data = serie.data.slice(sliceIndex);
				});
			}

			$("#" + config.rootNode + '_loss').highcharts({
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: null,
					type: 'bar',
					events: {
						load: function () {
							// $('#' + config.tclChart.container + " .highcharts-legend").appendTo('#' + config.tclChart.container + "-legend");
							// this.setSize(300, 400);
						}
					}
				},
				colors: colors,
				title: {
					text: config.lossChart.title
				},
				xAxis: {
					categories: xLabels,
					maxPadding: 0.35,
					title: {
						text: null
					}
				},
				yAxis: {
					stackLabels: {
						enabled: true
					},
					title: {
						text: null
					}
				},
				legend: {
					enabled: false,
					verticalAlign: 'bottom'
				},
				plotOptions: {
					series: {
						stacking: 'normal'
					}
				},
				series: series,
				credits: {
					enabled: false
				}
			});

		},


		/*
			@param {array} histogramData
			@param {number} pixelSize
			@param {object} config
			@param {function} encoder
			@param {boolean} useSimpleEncoderRule
		*/
		renderClearanceData: function (histogramData, pixelSize, config, encoder, useSimpleEncoderRule) {
			var yLabels = config.labels,
					yMapValues = config.bounds.fromBounds(),
					xMapValues = report.clearanceBounds.fromBounds(),
					// mapFunction = function(item){return (item*pixelSize*pixelSize)/10000; },
					series = [],
					data = [],
					location,
					value,
					i, j;

			// Config eventually needs to be updated as this is no longer a pie chart
			// Pie chart code and config are staying this way until client approves
			// Will still need the if else, the else section constructs a series with only one value

			if (config.clearanceChart.type === 'pie') {
				// for (i = 0; i < yMapValues.length; i++) {
				// 	value = 0;
				// 	for (j = 0; j < xMapValues.length; j++) {
				// 		location = encoder.encode(xMapValues[j], yMapValues[i]);
				// 		value += (histogramData[location] || 0);
				// 	}
				// 	series.push(value);
				// }

				// Account for pixelSize 
				// series.map(mapFunction);

				// for (i = 0; i < series.length; i++) {
				// 	data.push([yLabels[i], series[i]]);
				// }

				// $("#" + config.rootNode + '_clearance').highcharts({
				// 	chart: {
				// 		plotBackgroundColor: null,
				// 		plotBorderWidth: null,
				// 		plotShadow: false
				// 	},
				// 	colors: config.colors,
				// 	title: {
				// 		text: config.clearanceChart.title
				// 	},
				// 	plotOptions: {
				// 		pie: {
				// 			allowPointSelect: true,
				// 			cursor: 'pointer',
				// 			showInLegend: true,
				// 			dataLabels: {
				// 				enabled: false
				// 			}
				// 		}
				// 	},
				// 	credits: {
				// 		enabled: false
				// 	},
				// 	legend: {
				// 		enabled: true
				// 	},
				// 	series: [{
				// 		type: 'pie',
				// 		name: 'Monthly Alerts',
				// 		data: data
				// 	}]
				// });
	
				// Format data for line chart
				for (i = 0; i < yMapValues.length; i++) {
					value = 0;
					data = [];
					for (j = 0; j < xMapValues.length; j++) {
						location = encoder.encode(xMapValues[j], yMapValues[i]);
						data.push(histogramData[location] || 0);
					}
					series.push({
						name: yLabels[i],
						data: data
					});
				}

				$("#" + config.rootNode + '_clearance').highcharts({
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false
					},
					colors: config.colors,
					title: {
						text: config.clearanceChart.title
					},
					xAxis: {
						categories: report.clearanceLabels
					},
					yAxis: {
						title: null,
            min: 0
					},
					legend: {
						enabled: true
					},
					credits: {
						enabled: false
					},
					series: series
				});


			} else {

				if (useSimpleEncoderRule) {
					// Remove first value as that is all the 0 values we dont want
					series = histogramData.slice(1);
				} else {
					for (i = 0; i < xMapValues.length; i++) {
						value = 0;
						for(j = 0; j < yMapValues.length; j++) {
							location = encoder.encode(xMapValues[i], yMapValues[j]);
							value += (histogramData[location] || 0);
						}
						series.push(value);
					}
				}

				$("#" + config.rootNode + '_clearance').highcharts({
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false
					},
					colors: ['#fb00b3'],
					title: {
						text: config.clearanceChart.title
					},
					xAxis: {
						categories: report.clearanceLabels
					},
					yAxis: {
						title: null,
						min: 0
					},
					legend: {
						enabled: false
					},
					credits: {
						enabled: false
					},
					series: [{
						'name': config.title,
						'data': series
					}]
				});

			}

		},

		/*
			Render Pie Chart and Badge as appropriate for the individual layers
			@param {object} configObjects
			@param {array} results
		*/
		renderFireData: function (configObjects, results) {
			// Combine the Results
			var features = results[0].features.concat(results[1].features),
					datasetTotal,
					chartData,
					rootNode,
					config,
					i;

			// Helper Functions
			/*
				@param {string} rootNode
				@param {number} activeFires number fires intersecting with dataset
				@param {number} totalActiveFires total number of fires in geometry
				@param {string} description description for the dataset used in the badge
			*/
			function createBadge(rootNode, activeFires, totalActiveFires, description) {
				var fragment = document.createDocumentFragment(),
						node = document.createElement('div'),
						dest = document.getElementById(rootNode + '_fire');

				node.className = "active-fires-badge";
				node.innerHTML = "<div>There are currently</div>" +
						"<div class='active-fires-label'>" +
							"<div>" + number.format(activeFires) + "</div>" +
							"<span>active fires</span>" +
						"</div>" +
						"<div>" + description + "</div>" +
						"<div class='total-active-fires-label'><span>" + number.format(totalActiveFires) + " total active fires</span></div>";

				// Append root to fragment and then fragment to document
				fragment.appendChild(node);
				dest.innerHTML = "";
				dest.appendChild(fragment);
			}

			/*
				THIS FUNCTION EXPECTS EXACTLY 2 LABELS AND DATA VALUES, NO MORE OR LESS
				@param {string} rootNode
				@param {array} bounds signifies the bounds of the data classes
				@param {array} data number fires intersecting with dataset in array relative to labels
				@param {array} labels array of labels describing which classes have fires in them
				@param {number} totalFires total number of fires
			*/
			function createSpecialBadge(rootNode, data, bounds, labels, totalFires) {
				var fragment = document.createDocumentFragment(),
						node = document.createElement('div'),
						dest = document.getElementById(rootNode + '_fire'),
						values = [];

				for (var i = 0; i < data.length; i++) {
					if (i >= bounds[0] && i <= bounds[1]) {
						values.push(data[i]);
					}
				}

				node.className = "active-fires-badge special";
				node.innerHTML = "<div>Active fires are detected in:</div>" +
												 "<div class='active-fires-label'>" +
												  		"<span>" + labels[0] + " Forests</span>" +
							 								"<div>" + number.format(values[0] || 0) + "</div>" + 
							 							"</div>" +
														"<div class='active-fires-label'>" +
															"<span>" + labels[1] + " Forests</span>" +
															"<div>" + number.format(values[1] || 0) + "</div>" + 
														"</div>" +
														"<div class='total-active-fires-label'><span>out of " + number.format(totalFires) + " total active fires</span></div>" +
												 "</div>";
				// Append root to fragment and then fragment to document
				fragment.appendChild(node);
				dest.innerHTML = "";
				dest.appendChild(fragment);
			}

			/*
				@param {string} rootNode
				@param {array} data 
				@param {string} labels
				@param {string} colors
				@param {string} bounds
				@param {string} title
				@param {string} description
			*/
			function createChart(rootNode, data, labels, colors, bounds, title, description) {
				var resultingData = [],
						labelCounter = 0,
						chartColors = [],
						i;

				for (i = 0; i < data.length; i++) {
					if (i >= bounds[0] && i <= bounds[1]) {
						if (data[i] !== 0 && !isNaN(data[i])) {
							resultingData.push([labels[labelCounter], data[i]]);
							chartColors.push(colors[labelCounter]);
						}
						labelCounter++;
					}
				}

				if (resultingData.length === 0) {
					createBadge(rootNode, 0, 0, description);
				} else if (labels.length === 2) {
					// For Values with only two labels, redirect to a specific type of badge
					createSpecialBadge(rootNode, data, bounds, labels, features.length);
				} else {

					$("#" + rootNode + "_fire").highcharts({
						chart: {
							plotBackgroundColor: null,
							plotBorderWidth: null,
							plotShadow: null
						},
						colors: chartColors,
						title: {
							text: "Active Fires"
						},
						plotOptions: {
							pie: {
								size: '75%',
								allowPointSelect: true,
								cursor: 'pointer',
								showInLegend: true,
								dataLabels: {
									enabled: false
								}
							}
						},
						credits: {
							enabled: true
						},
						legend: {
							enabled: false
						},
						series: [{
							type: 'pie',
							name: 'Fires',
							data: resultingData
						}]
					});

				}

			}
			// Helper Functions


			arrayUtils.forEach(configObjects, function (item) {

				rootNode = item.rootNode;
				config = ReportConfig.fires[item.fireKey];
				
				if (features.length === 0) {
					createBadge(rootNode, 0, 0, config.badgeDesc);
				} else if (config.type === 'pie') {
					chartData = [];
					// Set initial values to 0 for all labels
					for (i = 0; i <= config.labels.length; i++) {
						chartData[i] = 0; 
					}
					arrayUtils.forEach(features, function (feature) {
						chartData[feature.attributes[config.field]]++;
					});
					createChart(rootNode, chartData, config.labels, config.colors, config.bounds, config.title, config.badgeDesc);
				} else {
					datasetTotal = 0;
					arrayUtils.forEach(features, function (feature) {
						datasetTotal += isNaN(parseInt(feature.attributes[config.field])) ? 0 : parseInt(feature.attributes[config.field]);
					});
					createBadge(rootNode, datasetTotal, features.length, config.badgeDesc);
				}
			});

		},

		/*
			Add No Data Available Text to the Appropriate location
			@param {object} response
			@param {object} config
			@param {function} encoder
		*/
		renderRSPOData: function (response, config, encoder) {
			var lossValues = ReportConfig.rspo.lossBounds.fromBounds(),
					self = this;

			// If there are results, build the table, else, mark dataNotAvailable to true
			if (response.histograms.length > 0) {
				var BASEYEAR = 2005,
						MAXCOUNT = 7,
						// variables to be used
						resultContent = "",
						agroPart = "",
						priPart = "",
						secPart = "",
						nonPart = "",
						years = [],
						agro = [],
						pri = [],
						sec = [],
						non = [],
						location,
						counts,
						i, j, k, l, m, n;

				// Start building the table and build the headers
				resultContent = "<table class='rspo-results-table'><tr><th>Forest Type</th>";
				for (i = 0; i <= MAXCOUNT; i++) {
					years.push(BASEYEAR + i);
					resultContent += "<th>" + (BASEYEAR + i) + "</th>";
				}
				resultContent += "</tr>";

				// Pull the correct values out of the histogram 
				counts = response.histograms[0].counts;

				for (j = 0; j < lossValues.length; j++) {
					location = encoder.encode(lossValues[j], 2);
					pri.push(counts[location]);
				}

				for (k = 0; k < lossValues.length; k++) {
					location = encoder.encode(lossValues[k], 3);
					sec.push(counts[location]);
				}

				for (l = 0; l < lossValues.length; l++) {
					location = encoder.encode(lossValues[l], 1);
					agro.push(counts[location]);
				}

				for (m = 0; m < lossValues.length; m++) {
					location = encoder.encode(lossValues[m], 0);
					non.push(counts[location]);
				}

				priPart = "<tr><td>Primary</td>";
				secPart = "<tr><td>Secondary</td>";
				agroPart = "<tr><td>Agroforestry</td>";
				nonPart = "<tr><td>Non-Forest</td>";

				for (n = 0; n < pri.length; n++) {
					priPart += "<td>" + (number.format(pri[n]) || "N/A") + "</td>";
					secPart += "<td>" + (number.format(sec[n]) || "N/A") + "</td>";
					agroPart += "<td>" + (number.format(agro[n]) || "N/A") + "</td>";
					nonPart += "<td>" + (number.format(non[n]) || "N/A") + "</td>";
				}

				priPart += "</tr>";
				secPart += "</tr>";
				agroPart += "</tr>";
				nonPart += "</tr>";

				resultContent += priPart + secPart + agroPart + nonPart + "</table>";
				resultContent += "<div class='change-area-unit'>(Change in Hectares)</div>";

				document.getElementById(config.rootNode + '_table').innerHTML = resultContent;
				this.renderRSPOChart(config, pri, sec, agro, non, years);

			} else {
				document.getElementById(config.rootNode + '_table').innerHTML = "<div class='data-not-available'>No RSPO Data Available for this Site.</div>";
				return;
			}

		},

		/*
			Add No Data Available Text to the Appropriate location
			@param {object} config
			@param {array} primary
			@param {array} secondary
			@param {array} agroforestry
			@param {array} nonforest
			@param {array} years
		*/
		renderRSPOChart: function (config, primary, secondary, agroforestry, nonforest, years) {

			var textColorObject = {
				color: '#000'
			},
			labelsDesign = {
				style: textColorObject
			};

			$("#" + config.rootNode + '_chart').highcharts({
				chart: {
					backgroundColor: '#FFF',
					type: 'column'
				},
				colors: config.colors,
				title: {
					text: null
				},
				legend: {
					align: 'center',
					verticalAlign: 'top',
					enabled: true
				},
				xAxis: {
					categories: years,
					labels: labelsDesign
				},
				yAxis: {
					title: {
						text: '',
						style: textColorObject
					},
					labels: labelsDesign
				},
				plotOptions: {
					column: {
						stacking: 'normal'
					}
				},
				tooltip: {
					formatter: function () {
						return '<strong>' + this.key + '</strong><br/>' + 
										this.series.name + ': ' + number.format(this.y) + '<br/>' +
										'Total: ' + number.format(this.point.stackTotal);
					}
				},
				credits: {
					enabled: false
				},
				series: [
					{'name': 'Primary', data: primary },
					{'name': 'Secondary', data: secondary},
					{'name': 'Agroforestry', data: agroforestry},
					{'name': 'Non-Forest', data: nonforest}
				]
			});
		},

		/*
			Gather an array of payloads from the report/Suitability module and create an output
			@param {object} config
			@param {array} payloads
				0 - getSuitableAreas
				1 - getLCHistogramData
				2 - getRoadData
				3 - getConcessionData
				4 - computeLegalHistogram
				Note: Each payload looks like this except for getConcessionData:
				{ data: histoData, pixelSize: 'pixelSize used in calculating'}
				getConcessionData just has a value: { value: 'Yes or No'}
		*/
		renderSuitabilityData: function (config, payloads) {
			var classIndices = config.lcHistogram.classIndices,
					content = "<table>",
					convFactor,
					unsuitable,
					suitable,
					area,
					roadDistance,
					concession,
					productionUse,
					convertibleUse,
					otherUse,
					histogram;

			// Get Suitabile Areas
			histogram = payloads[0];
			if (histogram) {
				convFactor = Math.pow(histogram.pixelSize / 100, 2);
				if (!histogram.data.counts[1]) {
					suitable = 0;
					unsuitable = number.format(histogram.data.counts[0] * convFactor);
					//area = number.format(histogram[0] * convFactor) || "---";
				} else {
					suitable = number.format(histogram.data.counts[1] * convFactor) || histogram.data.counts[1];
					unsuitable = number.format(histogram.data.counts[0] * convFactor) || histogram.data.counts[0];
					//area = number.format((histogram[0] + histogram[1]) * convFactor) || "---";
				}
			} else {
				suitable = 'N/A';
				unsuitable = 'N/A';
				//area = 'N/A';
			}

			// Get LC Histogram Data
			histogram = payloads[1];
			if (histogram) {
				convFactor = Math.pow(histogram.pixelSize / 100, 2);
				var getValue = function(indices) {
					var value = 0;
					for (var i = 0; i < indices.length; i++) {
						if (histogram.data.counts[indices[i]]) {
							value += (histogram.data.counts[indices[i]] * convFactor);
						}
					}
					return number.format(value);
				};
				productionUse = getValue(classIndices.production);
				convertibleUse = getValue(classIndices.convertible);
				otherUse = getValue(classIndices.other);
			} else {
				productionUse = 'N/A';
				convertibleUse = 'N/A';
				otherUse = 'N/A';
			}

			// Get Road Data
			histogram = payloads[2];
			if (histogram) {
				roadDistance = parseFloat(histogram.data.min / 1000).toFixed(1);
			} else {
				roadDistance = 'N/A';
			}

			// Get Concession Data
			histogram = payloads[3];
			if (histogram) {
				concession = histogram.value;
			} else {
				concession = 'N/A';
			}

			// Set Suitabile Areas content
			content += "<tr><td>Suitable(ha):</td><td>" + suitable + "</td></tr>";
			content += "<tr><td>Unsuitable(ha):</td><td>" + unsuitable + "</td></tr>";
			// Set Road Data Content
			content += "<tr><td>Distance to nearest road(km):</td><td>" + roadDistance + "</td></tr>";
			// Set Concession Data Content
			content += "<tr><td>Existing concessions(Yes/No):</td><td>" + concession + "</td></tr>";
			// Set LC Histogram Data
			content += "<tr><td>Legal Classification(ha):</td><td></td></tr>";
			content += "<tr><td class='child-row'>Production forest(HP/HPT):</td><td>" + productionUse + "</td></tr>";
			content += "<tr><td class='child-row'>Convertible forest(HPK):</td><td>" + convertibleUse + "</td></tr>";
			content += "<tr><td class='child-row'>Other land uses(APL):</td><td>" + otherUse + "</td></tr>";
			content += "</table>";
			// Add Local rights/interests and field assessment links
			content += "<p>" + config.localRights.content + "</p>";
			content += "<div class='field-assessment-link'>" + 
									 "<a href='" + config.localRights.fieldAssessmentUrl + "'>" + config.localRights.fieldAssessmentLabel + "</a>" + 
									"</div>";

			document.getElementById(config.rootNode + '_content').innerHTML = content;
			this.renderSuitabilityChart(config, payloads[4]);
			
		},

		/*
			Take the payload related to the chart and render the chart or a data not available
			@param {object} config
			@param {object} payload
		*/
		renderSuitabilityChart: function (config, payload) {

			if (!payload) {
				document.getElementById(config.rootNode + "_chart").innerHTML = "<div class='data-not-available'>No Suitability Data Available to chart for this Site.</div>";
				return;
			}

			var classIndices = config.lcHistogram.classIndices,
					convFactor = Math.pow(payload.pixelSize / 100, 2),
					chartConfig = config.chart,
					chartData = [],
					innerValues = [],
					outerValues = [],
					convertible,
					production,
					other;
			

			// Build data Objects for chart
			function buildValues(indices) {
				var value = {
					suitable: 0,
					unsuitable: 0
				};

				for (var i = 0; i < indices.length; i++) {
					if (payload.data.counts[indices[i]]) {
						value.unsuitable += (payload.data.counts[indices[i]] * convFactor);
						value.suitable += (payload.data.counts[indices[i] + 10] * convFactor);
					}
				}
				return value;
			}

			convertible = buildValues(classIndices.convertible);
			production = buildValues(classIndices.production);
			other = buildValues(classIndices.other);

			// Format the Two Main Entries with the inner entries as children
			chartData.push({
				y: (convertible.suitable + production.suitable + other.suitable),
				color: chartConfig.suitable.color,
				name: chartConfig.suitable.name,
				id: chartConfig.suitable.id,
				children: {
					categories: chartConfig.childrenLabels,
					colors: chartConfig.childrenColors,
					data: [production.suitable, convertible.suitable, other.suitable]
				}
			});

			chartData.push({
				y: (convertible.unsuitable + production.unsuitable + other.unsuitable),
				color: chartConfig.unsuitable.color,
				name: chartConfig.unsuitable.name,
				id: chartConfig.unsuitable.id,
				children: {
					categories: chartConfig.childrenLabels,
					colors: chartConfig.childrenColors,
					data: [production.unsuitable, convertible.unsuitable, other.unsuitable]
				}
			});

			// Begin Building the Chart
			for (var i = 0; i < chartData.length; i++) {
				if (chartData[i].y > 0) {
					innerValues.push({
						color: chartData[i].color,
						name: chartData[i].name,
						id: chartData[i].id,
						y: chartData[i].y
					});
					for (var j = 0; j < chartData[i].children.data.length; j++) {
            if (chartData[i].children.data[j] > 0) {
              outerValues.push({
                name: chartData[i].children.categories[j],
                color: chartData[i].children.colors[j],
                y: chartData[i].children.data[j],
                parentId: chartData[i].id
              });
            }
          }
				}
			}

			$("#" + config.rootNode + "_chart").highcharts({
				chart: {
					type: 'pie',
					backgroundColor: '#FFF',
					plotBorderWidth: null
				},
				title: {
					text: null
				},
				tooltip: {
					valueSuffix: ''
				},
				plotOptions: {
					series: {
						point: {
							events: {
								legendItemClick: function () {
									var id = this.id,
											data = this.series.chart.series[1].data;
									data.forEach(function (item) {
										if (item.parentId === id) {
											if (item.visible) { item.setVisible(false);} else { item.setVisible(true);}
										}
									});
								}
							}
						}
					}
				},
				legend: {
					itemStyle: {
						color: "#000"
					}
				},
				credits: {
					enabled: false
				},
				series: [{
					name: 'Area',
					data: innerValues,
					size: "60%",
					showInLegend: true,
					dataLabels: {
						enabled: false
					}
				}, {
					name: 'Legal Area',
					data: outerValues,
					size: "80%",
					innerSize: "60%",
					dataLabels: {
						color: 'black',
						distance: 5
					}
				}]
			});


		},

		/*
			@param {array} mills An array of mill objects as part of the results, max should be 5
			@param {object} config
		*/
		renderMillAssessment: function (mills, config) {

			var millTables = [],
					headerContent = "<div id='value-toggle' class='value-toggle'><span class='toggle-label'>Show Values</span>" + 
										"<span class='toggle-button-container active'><span class='toggle-knob'></span></span></div>",
					content = "",
					title;

			arrayUtils.forEach(mills, function (mill) {
				// Create Header
				// If there were multiple mills, there attributes are in report.mills
				if (report.mills) {
					arrayUtils.some(report.mills, function (millAttrs) {
						if (mill.id === millAttrs.id) {
							title = millAttrs.label;
							return true;
						}
					});
					// If no title is found, use default title, this is probably because we are using the MOCK API
					// and don't have real results back yet
					if (title === undefined) { title = window.payload.title; }
				} else {
					// Else use the window.payload.title as the title, thats the title of an individual mill
					title = window.payload.title;
				}


				content = "<div class='mill-header'><span class='mill-title'>" + window.payload.title + "</span>" + 
									"<span class='mill-risk-level " + mill.risk + "'><span class='large-swatch'></span>" + 
									"Total Mill Risk Level: <span class='overall-risk'>" + mill.risk + "</span></span></div>";
				// Create Table
				content += "<table><tr><th></th><th colspan='2'>Concession<span class='info-icon' data-type='concession'></span>" + 
									 "</th><th colspan='2'>Radius<span class='info-icon' data-type='radius'></span></th></tr>";
				// Generate Rows for Each section of data
				// content += generateRow('RSPO certification', mill.rspo);
				// content += generateRow('Deforestation', mill.deforestation, 'deforest-' + mill.id);
				/* Child Rows */
				content += generateRow('Total tree cover loss', mill.deforestation['umd_loss'], null, 'deforest-' + mill.id);
				content += generateRow('Tree cover loss on primary forest', mill.deforestation['umd_loss_primary'], null, 'deforest-' + mill.id);
				content += generateRow('Total clearance alerts', mill.deforestation.forma, null, 'deforest-' + mill.id);
				content += generateRow('Clearance alerts on primary forest', mill.deforestation['forma_primary'], null, 'deforest-' + mill.id);
				content += generateRow('Tree cover loss on carbon stock', mill.deforestation.carbon, null, 'deforest-' + mill.id);
				/* Child Rows */
				content += generateRow('Legality', mill.legal);
				// content += generateRow('Peat', mill.peat, 'peat-' + mill.id);
				/* Child Rows */
				content += generateRow('Presence of peat', mill.peat.presence, null, 'peat-' + mill.id);
				content += generateRow('Clearance on peat', mill.peat.clearance, null, 'peat-' + mill.id);
				/* Child Rows */
				content += generateRow('Fires', mill.fire);
				content += "</table>";
				millTables.push(content);
			});

			// Takes a piece of the results and returns a html row
			/*
				@param {string} name - Represents Name in table row
				@param {object} data - Represents segment of response
				@param {string} parentClass - (OPTIONAL) - class of parent and child
				@param {string} childClass - (OPTIONAL) - class of child, same as parent
				@return String - HTML Fragment which is a <tr>
			*/
			function generateRow(name, data, parentClass, childClass) {
				// If child is to be open by default, add open class below if parentClass is defined, 
				// so data-row parent open are all in if parentClass is defined
				var rowClass = parentClass ? 'data-row parent' : 'data-row';
				rowClass += childClass ? ' child ' + childClass : '';
				
				// If this is a parent, will need a special data-class attribute and an extra span for showing the toggle
				var frag = "<tr class='" + rowClass + "' " + (parentClass? "data-class='" + parentClass + "'" : "") + ">" + 
									 "<td class='row-name'>" + (parentClass? "<span class='toggle-icon'></span>" : "") + "<span>" + name + "</span></td>";
				frag += "<td class='" + data.concession.risk + "'><span class='large-swatch'></span><span class='risk-label'>" + data.concession.risk + "</span></td>";
				frag += "<td>" + data.concession.raw + "</td>";
				frag += "<td class='" + data.radius.risk + "'><span class='large-swatch'></span><span class='risk-label'>" + data.radius.risk + "</span></td>";
				frag += "<td>" + data.radius.raw + "</td>";
				frag += "</tr>";
				return frag;
			}

			// Add the Content
			document.getElementById(config.rootNode + "_table").innerHTML = headerContent + millTables.join('<br />');

			// Toggle Functions
			/*
				Toggle Values Columns and and set colspan to correct values for all rows
			*/
			function toggleValues() {
				var node = $(".toggle-button-container"),
						colspan = node.hasClass('active') ? 2 : 1;
				// Toggle the active class
				node.toggleClass('active');
				// Update the look of the table
				$('.mill-table-container tr.data-row td:nth-child(3)').toggle();
				$('.mill-table-container tr.data-row td:nth-child(5)').toggle();
				$('.mill-table-container tr.data-row td:nth-child(2)').attr('colspan', colspan);
				$('.mill-table-container tr.data-row td:nth-child(4)').attr('colspan', colspan);
			}

			/*
				Toggle children rows display related to the current targets data-class attribute
				@param {MouseEvent} evt
			*/
			function toggleChildren(evt) {
				var target = evt.currentTarget,
						dataClass = target.dataset ? target.dataset.class : target.getAttribute('data-class');

				$('.mill-table-container .data-row.child.' + dataClass).toggle();
				$(target).toggleClass('open');
			}

			// Set up Click Listeners to give table custom toggling functionality and show information on info classes
			$("#value-toggle").click(toggleValues);
			$(".mill-table-container tr.parent").click(toggleChildren);
			$(".mill-table-container .info-icon").click(this.showMillPointInfo);

			// Hide children by default
			$('.mill-table-container .data-row.child').toggle();

		},

		/*
				Show popup dialog with information relating to the value of the target's data-type attribute
				@param {MouseEvent} evt
			*/
		showMillPointInfo: function (evt) {
			var target = evt.currentTarget,
					type = target.dataset ? target.dataset.type : target.getAttribute('data-type'),
					config = ReportConfig.millPointInfo[type],
					dialog;

			dialog = new Dialog({
				title: config.title,
				content: config.content,
				style: "width: 300px;"
			});
			
			dialog.show();
		},

		/*
			Add No Data Available Text to the Appropriate location
			@param {string} type --> Options = loss, clearance, mill
			@param {object} config
		*/
		renderAsUnavailable: function (type, config) {
			var node = document.getElementById(config.rootNode + '_' + type),
					msg = "";

			if (type === 'loss') {
				msg = "No Tree Cover Loss Data Available for this site.";
			} else if (type === 'clearance') {
				msg = "No Clearance Alert Data Available for this site.";
			} else if (type === 'composition') {
				msg = "No Composition Analysis Data Available for this site.";
			} else {
				msg = "No Mill Point Data Available for this site.";
			}

			if (node) {
				node.innerHTML = msg;
			}
		}

	};

});