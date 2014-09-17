define([
	"report/config",
	"dojo/number"
], function (ReportConfig, number) {
	'use strict';

	// Container IDS for charts and tables are as Follows
	// config.rootNode + '_loss'
	// config.rootNode + '_clearance'
	// config.rootNode + '_fire'
	// config.rootNode + '_mill'

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
						"<div class='left-panel'>" +
							"<div class='loss-chart' id='" + config.rootNode + "_loss'></div>" +
						"</div>" +
						"<div class='right-panel'>" +
							"<div class='fires-chart' id='" + config.rootNode + "_fire'></div>" +
						"</div>" +
					"</div>" +
					"<div class='result-block clearance-alerts'>" +
						"<div class='clearance-chart' id='" + config.rootNode + "_clearance'></div>" +
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
		renderRSPOContainer: function (config) {
			var fragment = document.createDocumentFragment(),
					node = document.createElement('div');

			node.id = config.rootNode;
			node.className = "result-container";
			node.innerHTML = "<div class='title'>" + config.title + "</div>" +
					"<div class='rspo-table-container' id='" + config.rootNode + "_table'></div>" + 
					"<div class='rspo-chart-container' id='" + config.rootNode + "_chart'></div>";

			// Append root to fragment and then fragment to document
			fragment.appendChild(node);
			document.getElementById('report-results-section').appendChild(fragment);

		},

		/*
			@param {array} histogramData
			@param {object} config
			@param {function} encoder
			@param {boolean} useSimpleEncoderRule
		*/
		renderLossData: function (histogramData, config, encoder, useSimpleEncoderRule) {
			var lossConfig = ReportConfig.totalLoss,
					yLabels = config.labels,
					xLabels = lossConfig.labels,
					yMapValues = config.bounds.fromBounds(),
					xMapValues = lossConfig.bounds.fromBounds(),
					series = [],
					colors = [],
					location,
					data,
					i, j;

			if (useSimpleEncoderRule) {
				series.push({
					'name': yLabels[0],
					'data': histogramData.slice(1) // Remove first value as that is all the 0 values we dont want
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
						'data': data
					});
					colors.push(config.colors[i]);
				}
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
			@param {object} config
			@param {function} encoder
			@param {boolean} useSimpleEncoderRule
		*/
		renderClearanceData: function (histogramData, config, encoder, useSimpleEncoderRule) {
			var yLabels = config.labels,
					yMapValues = config.bounds.fromBounds(),
					xMapValues = report.clearanceBounds.fromBounds(),
					series = [],
					data = [],
					location,
					value,
					i, j;

			if (config.clearanceChart.type === 'pie') {
				for (i = 0; i < yMapValues.length; i++) {
					value = 0;
					for (j = 0; j < xMapValues.length; j++) {
						location = encoder.encode(xMapValues[j], yMapValues[i]);
						value += (histogramData[location] || 0);
					}
					series.push(value);
				}

				for (i = 0; i < series.length; i++) {
					data.push([yLabels[i], series[i]]);
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
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							showInLegend: true,
							dataLabels: {
								enabled: false
							}
						}
					},
					credits: {
						enabled: false
					},
					legend: {
						enabled: true
					},
					series: [{
						type: 'pie',
						name: 'Monthly Alerts',
						data: data
					}]
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
						title: null
					},
					legend: {
						enabled: false
					},
					credits: {
						enabled: false
					},
					series: [{
						'name': 'Clearance Alerts',
						'data': series
					}]
				});

			}

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
				document.getElementById(config.rootNode + '_table').innerHTML = "<div class='data-not-available'>No Data Available for this Site.</div>";
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
			Add No Data Available Text to the Appropriate location
			@param {string} type --> Options = loss, clearance, mill
			@param {object} config
		*/
		renderAsUnavailable: function (type, config) {
			var node = document.getElementById(config.rootNode + '_' + type);
			if (node) {
				node.innerHTML = "No Data Available for this site.";
			}
		}

	};

});