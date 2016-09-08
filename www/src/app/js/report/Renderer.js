define([
  "report/config",
  "dojo/number",
  "dijit/Dialog",
  "dojo/_base/array",
  "dojo/on",
  "dojo/dom",
  "dojo/dom-style",
  "report/CSVExporter",
  "utils/Analytics"
], function (ReportConfig, number, Dialog, arrayUtils, on, dom, domStyle, CSVExporter, Analytics) {
  'use strict';

  // Container IDS for charts and tables are as Follows
  // config.rootNode + '_loss'
  // config.rootNode + '_clearance'
  // config.rootNode + '_fire'
  // config.rootNode + '_mill'
  // Suitability Analysis
  // config.rootNode + '_content'
  // config.rootNode + '_chart'

  var exportButtonImagePath = 'url(./app/css/images/download-icon.svg)';

  return {

    /*
      @param {object} config
    */
    renderContainers: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map');

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
      document.getElementById('report-results-section').insertBefore(fragment, map);
    },

    /*
      @param {object} config
    */
    renderTotalLossContainer: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map');

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
      document.getElementById('report-results-section').insertBefore(fragment, map);
    },

    /*
      @param {object} config
    */
    renderProdesContainer: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map');

      node.id = config.rootNode;
      node.className = "result-container";
      node.innerHTML = "<div class='title'>" + config.title + "</div>" +
          "<div class='result-block prodes'>" +
            "<div class='top-panel' id='" + config.rootNode + "_composition'></div>" +
            "<div class='left-panel'>" +
              "<div class='prodes-chart' id='" + config.rootNode + "_prodes'><div class='loader-wheel'>prodes</div></div>" +
            "</div>" +
          "</div>";

      // Append root to fragment and then fragment to document
      fragment.appendChild(node);
      document.getElementById('report-results-section').insertBefore(fragment, map);
    },

    /*
      @param {object} config
    */
    renderGuyraContainer: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map');

      node.id = config.rootNode;
      node.className = "result-container";
      node.innerHTML = "<div class='title'>" + config.title + "</div>" +
          "<div class='result-block guyra'>" +
            // "<div class='top-panel' id='" + config.rootNode + "_composition'></div>" +
            "<div>" +
              "<div class='guyra-chart' id='" + config.rootNode + "_guyra'><div class='loader-wheel'>guyra</div></div>" +
            "</div>" +
          "</div>";

      // Append root to fragment and then fragment to document
      fragment.appendChild(node);
      document.getElementById('report-results-section').insertBefore(fragment, map);
    },

    /*
      @param {object} config
    */
    renderRSPOContainer: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map');

      node.id = config.rootNode;
      node.className = "result-container";
      node.innerHTML = "<div class='title'>" + config.title + "</div>" +
          "<div class='rspo-table-container' id='" + config.rootNode + "_table'><div class='loader-wheel'>rspo analysis</div></div>" +
          "<div class='rspo-chart-container' id='" + config.rootNode + "_chart'></div>";

      // Append root to fragment and then fragment to document
      fragment.appendChild(node);
      document.getElementById('report-results-section').insertBefore(fragment, map);

    },

    /*
      @param {object} config
    */
    renderSuitabilityContainer: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map');

      node.id = config.rootNode;
      node.className = "result-container";
      node.innerHTML = "<div class='title'>" + config.title + "</div>" +
          "<div class='suitability-container'>" +
            "<div class='left-panel'>" +
              "<div id='suitability-table-csv' class='csv-download' title='Download CSV'></div>" +
              "<div id='" + config.rootNode + "_content' class='suitability-content'><div class='loader-wheel'>suitability</div></div>" +
            "</div>" +
            "<div class='right-panel'>" +
              "<div id='" + config.rootNode + "_chart' class='suitability-chart'><div class='loader-wheel'>suitability</div></div>" +
            "</div>" +
            "<div class='clearFix'></div>" +
            "<div class='left-panel'>" +
              "<div class='suitability-settings-table-header'>Suitability Settings</div>" +
              "<div id='suitability-settings-csv' class='csv-download' title='Download CSV'></div>" +
              "<div id='suitability-settings-table'></div>" +
            "</div>" +
            "<div class='right-panel'>" +
              "<div id='suitability-composition-analysis'><div class='loader-wheel'>composition</div></div>" +
            "</div>" +
          "</div>";

      // Append root to fragment and then fragment to document
      fragment.appendChild(node);
      document.getElementById('report-results-section').insertBefore(fragment, map);
    },

    /*
      @param {object} config
    */
    renderMillContainer: function (config) {
      var fragment = document.createDocumentFragment(),
          node = document.createElement('div'),
          map = document.getElementById('print-map'),
          downloadButton;

      downloadButton = "<button id='mill-download' class='mill-download-button' title='Download csv'></button>";
      node.id = config.rootNode;
      node.className = "result-container relative";
      node.innerHTML = "<div class='title'>" + config.title + downloadButton + "</div>" +
          "<div id='mill-overall-container'></div>" +
          "<div class='mill-table-container' id='" + config.rootNode + "_table'><div class='loader-wheel'>risk assessment</div></div>";

      // Append root to fragment and then fragment to document
      fragment.appendChild(node);
      document.getElementById('report-results-section').insertBefore(fragment, map);
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

      if (area.length === 0) {
        this.renderAsUnavailable('composition', config);
        return;
      }

      area = (area.reduce(function(a,b){return a + b;}) * pixelSize * pixelSize) / 10000;
      areaLabel = number.format(area);

      report.areaPromise.then(function(){

        percentage = number.format((area/report.area)*100, {places: 0});

        node.className = "composition-analysis-container";
        node.innerHTML =  "<div>Total " + title + " in selected area: " + areaLabel + " ha</div>" +
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
          yMapValues = arrayFromBounds(config.bounds),
          xMapValues = arrayFromBounds(lossConfig.bounds),
          mapFunction = function(item){return (item*pixelSize*pixelSize)/10000; },
          series = [],
          colors = [],
          location,
          sliceIndex,
          data,
          i, j;

      if (useSimpleEncoderRule) {
        // Remove first value as that is all the 0 values we dont want
        data = histogramData.slice(1).map(mapFunction);
        // Pad the array with 0's for all remaining years if data is missing
        if (data.length !== xLabels.length) {
          for (var index = 0; index < xLabels.length; index++) {
            if (data[index] === undefined) data[index] = 0;
          }
        }

        series.push({
          'name': yLabels[0],
          'data': data
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
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
            }
          }
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
          yMapValues = arrayFromBounds(config.bounds),
          xMapValues = arrayFromBounds(lossConfig.bounds),
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

      // Show All 0's if no data is present
      if (series[0].data.length !== xLabels.length) {
        for (var index = 0; index < xLabels.length; index++) {
          if (series[0].data[index] === undefined) series[0].data[index] = 0;
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
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
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
    */
    renderProdesData: function (histogramData, pixelSize, config) {

      var prodesConfig = ReportConfig.prodesLayer,
          yLabels = config.labels,
          xLabels = prodesConfig.labels,
          mapFunction = function(item){return (item * pixelSize * pixelSize) / 10000; },
          series = [],
          colors = [];

      series.push({
        'name': yLabels[0],
        'data': histogramData.slice(1).map(mapFunction) // Remove first value as that is all the 0 values we dont want
      });
      colors.push(config.color);

      // Show All 0's if no data is present
      if (series[0].data.length !== xLabels.length) {
        for (var index = 0; index < xLabels.length; index++) {
          if (series[0].data[index] === undefined) series[0].data[index] = 0;
        }
      }


      $("#" + config.rootNode + '_prodes').highcharts({
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
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
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
    */
    renderGuyraData: function (histogramData, pixelSize, config) {

      var guyraConfig = ReportConfig.guyraLayer,
          yLabels = config.labels,
          xLabels = guyraConfig.labels,
          mapFunction = function(item){return (item * pixelSize * pixelSize) / 10000; },
          series = [],
          colors = [];

      var data = histogramData.slice(1).map(mapFunction);

      var baseMonth = 9;
      data.forEach(function (value, index) {
        //- index represents the month after the base month, so first value is for september, 2nd for October, etc.
        //- the - 1 is because the months are indexed base, new Date('2016', 9, 1) yields October, not September
        series.push([new Date('2011', (index + baseMonth - 1), 1).getTime(), value]);
      });
      // series.push({
      //   'name': yLabels[0],
      //   'data': histogramData.slice(1).map(mapFunction) // Remove first value as that is all the 0 values we dont want
      // });
      colors.push(config.color);

      // // Show All 0's if no data is present
      // if (series[0].data.length !== xLabels.length) {
      //   for (var index = 0; index < xLabels.length; index++) {
      //     if (series[0].data[index] === undefined) {
      //       series[0].data[index] = 0;
      //     }
      //   }
      // }

      $('#' + config.rootNode + '_guyra').highcharts({
        chart: {
          zoomType: 'x',
          resetZoomButton: {
            position: {
              align: 'left',
              y: 0
            }
          }
        },
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
            }
          }
        },
        title: { text: null },
        xAxis: {
          type: 'datetime'
        },
        credits: { enabled: false },
        yAxis: { title: { text: 'hectares' }, min: 0 },
        plotOptions: {
          column: {
            color: config.color
          }
        },
        tooltip: {
          dateTimeLabelFormats: { hour: '%b' }
        },
        legend: {
          enabled: false
        },
        series: [{
          type: 'column',
          name: config.title,
          data: series
        }]
      });


      // $('#' + config.rootNode + '_guyra').highcharts({
      //   chart: {
      //     plotBackgroundColor: null,
      //     plotBorderWidth: null,
      //     plotShadow: null,
      //     type: 'bar',
      //     events: {
      //       load: function () {
      //         // $('#' + config.tclChart.container + ' .highcharts-legend').appendTo('#' + config.tclChart.container + '-legend');
      //         // this.setSize(300, 400);
      //       }
      //     }
      //   },
      //   exporting: {
      //     buttons: {
      //       contextButton: { enabled: false },
      //       exportButton: {
      //         menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
      //         symbol: exportButtonImagePath
      //       }
      //     }
      //   },
      //   colors: colors,
      //   title: {
      //     text: config.lossChart.title
      //   },
      //   xAxis: {
      //     categories: xLabels,
      //     maxPadding: 0.35,
      //     title: {
      //       text: null
      //     }
      //   },
      //   yAxis: {
      //     stackLabels: {
      //       enabled: true
      //     },
      //     title: {
      //       text: null
      //     }
      //   },
      //   legend: {
      //     enabled: false,
      //     verticalAlign: 'bottom'
      //   },
      //   plotOptions: {
      //     series: {
      //       stacking: 'normal'
      //     }
      //   },
      //   series: series,
      //   credits: {
      //     enabled: false
      //   }
      // });

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
          yMapValues = arrayFromBounds(config.bounds),
          xMapValues = arrayFromBounds(report.clearanceBounds),
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
        //  value = 0;
        //  for (j = 0; j < xMapValues.length; j++) {
        //    location = encoder.encode(xMapValues[j], yMapValues[i]);
        //    value += (histogramData[location] || 0);
        //  }
        //  series.push(value);
        // }

        // Account for pixelSize
        // series.map(mapFunction);

        // for (i = 0; i < series.length; i++) {
        //  data.push([yLabels[i], series[i]]);
        // }

        // $('#' + config.rootNode + '_clearance').highcharts({
        //  chart: {
        //    plotBackgroundColor: null,
        //    plotBorderWidth: null,
        //    plotShadow: false
        //  },
        //  colors: config.colors,
        //  title: {
        //    text: config.clearanceChart.title
        //  },
        //  plotOptions: {
        //    pie: {
        //      allowPointSelect: true,
        //      cursor: 'pointer',
        //      showInLegend: true,
        //      dataLabels: {
        //        enabled: false
        //      }
        //    }
        //  },
        //  credits: {
        //    enabled: false
        //  },
        //  legend: {
        //    enabled: true
        //  },
        //  series: [{
        //    type: 'pie',
        //    name: 'Monthly Alerts',
        //    data: data
        //  }]
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

        // if (series.length === 0) {
        //  this.renderAsUnavailable('clearance', config);
        //  return;
        // }

        $('#' + config.rootNode + '_clearance').highcharts({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
          },
          exporting: {
            buttons: {
              contextButton: { enabled: false },
              exportButton: {
                menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
                symbol: exportButtonImagePath
              }
            }
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

          // Pad the array with 0's for all remaining years if data is missing
          if (series.length !== xMapValues.length) {
            for (var index = 0; index < xMapValues.length; index++) {
              if (series[index] === undefined) series[index] = 0;
            }
          }

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

        //series = series.slice(series.length - 6, series.length); //todo: Remove this slice hack after the 2014 data has been taken out of the service

        $('#' + config.rootNode + '_clearance').highcharts({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
          },
          exporting: {
            buttons: {
              contextButton: { enabled: false },
              exportButton: {
                menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
                symbol: exportButtonImagePath
              }
            }
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

    renderGladData: function (histogramData, pixelSize, config, encoder, useSimpleEncoderRule) {
      var yLabels = config.labels,
          yMapValues = arrayFromBounds(config.bounds),
          xMapValues = arrayFromBounds(report.gladLayer),
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

        $('#' + config.rootNode + '_clearance').highcharts({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
          },
          exporting: {
            buttons: {
              contextButton: { enabled: false },
              exportButton: {
                menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
                symbol: exportButtonImagePath
              }
            }
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

          // Pad the array with 0's for all remaining years if data is missing
          if (series.length !== xMapValues.length) {
            for (var index = 0; index < xMapValues.length; index++) {
              if (series[index] === undefined) series[index] = 0;
            }
          }

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

        //series = series.slice(series.length - 6, series.length); //todo: Remove this slice hack after the 2014 data has been taken out of the service

        $('#' + config.rootNode + '_clearance').highcharts({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
          },
          exporting: {
            buttons: {
              contextButton: { enabled: false },
              exportButton: {
                menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
                symbol: exportButtonImagePath
              }
            }
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
      // var features = results[0].features.concat(results[1].features),
      var features = results[0].features,
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
            exporting: {
              buttons: {
                contextButton: { enabled: false },
                exportButton: {
                  menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
                  symbol: exportButtonImagePath
                }
              }
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

        // First IF is Temporary until fires layers are merged and we dont need to query two layers
        if (results.length > 1 && item.fireKey === 'indonesiaMoratorium') {
          var total = 0;
          arrayUtils.forEach(results[1].features, function (result) {
            total += +result.attributes[config.field];
          });
          createBadge(rootNode, total, features.length, config.badgeDesc);
          return;
        }

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
      var lossValues = arrayFromBounds(ReportConfig.rspo.lossBounds),
          self = this;

      // If there are results, build the table, else, mark dataNotAvailable to true
      if (response.histograms.length > 0) {
        var BASEYEAR = 2005,
            MAXCOUNT = 8,
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
            i, j, n;

        // Start building the table and build the headers
        resultContent = "<div id='rspo-table-csv' class='csv-download' title='Download CSV'></div><table class='rspo-results-table'><tr><th>Forest Type</th>";
        for (i = 0; i <= MAXCOUNT; i++) {
          years.push(BASEYEAR + i);
          resultContent += "<th>" + (BASEYEAR + i) + "</th>";
        }
        resultContent += "</tr>";

        // Pull the correct values out of the histogram
        counts = response.histograms[0].counts;

        for (j = 0; j < lossValues.length; j++) {
          // Primary Forest
          location = encoder.encode(lossValues[j], 2);
          pri.push(counts[location] || 0);
          // Secondary Forest
          location = encoder.encode(lossValues[j], 3);
          sec.push(counts[location] || 0);
          // Agroforesty Forest
          location = encoder.encode(lossValues[j], 1);
          agro.push(counts[location] || 0);
          // Non-Forest
          location = encoder.encode(lossValues[j], 0);
          non.push(counts[location] || 0);
        }

        priPart = "<tr><td>Primary</td>";
        secPart = "<tr><td>Secondary</td>";
        agroPart = "<tr><td>Agroforestry</td>";
        nonPart = "<tr><td>Non-Forest</td>";

        for (n = 0; n < pri.length; n++) {
          priPart += "<td>" + (number.format(pri[n]) || 0) + "</td>";
          secPart += "<td>" + (number.format(sec[n]) || 0) + "</td>";
          agroPart += "<td>" + (number.format(agro[n]) || 0) + "</td>";
          nonPart += "<td>" + (number.format(non[n]) || 0) + "</td>";
        }

        priPart += "</tr>";
        secPart += "</tr>";
        agroPart += "</tr>";
        nonPart += "</tr>";

        resultContent += priPart + secPart + agroPart + nonPart + "</table>";
        resultContent += "<div class='change-area-unit'>(Change in Hectares)</div>";

        document.getElementById(config.rootNode + '_table').innerHTML = resultContent;
        this.renderRSPOChart(config, pri, sec, agro, non, years);

        // Add Click Handler for downloading CSV Data
        // Everything is handled in this callback because Im not sure we need this feature
        // The chart that renders below this table has an export already and it is the exact same thing
        $('#rspo-table-csv').click(function () {
          var lineEnding = '\r\n';
          var csvData = [];
          var values = [];
          var output = '';

          csvData.push('RSPO Land Use Change Analysis');
          csvData.push(document.getElementById('title').innerHTML);

          arrayUtils.forEach(years, function (year) {
            values.push(year);
          });
          csvData.push('Forest Type,' + values.join(','));

          values = [];
          arrayUtils.forEach(pri, function (year) {
            values.push(year);
          });
          csvData.push('Primary,' + values.join(','));

          values = [];
          arrayUtils.forEach(sec, function (year) {
            values.push(year);
          });
          csvData.push('Secondary,' + values.join(','));

          values = [];
          arrayUtils.forEach(agro, function (year) {
            values.push(year);
          });
          csvData.push('Agroforestry,' + values.join(','));

          values = [];
          arrayUtils.forEach(non, function (year) {
            values.push(year);
          });
          csvData.push('Non-Forest,' + values.join(','));

          output = csvData.join(lineEnding);

          CSVExporter.exportCSV(output);

          Analytics.sendEvent('Event', 'Download CSV', 'User downloaded RSPO results table.');

        });

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
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
            }
          }
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
      this.renderSuitabilitySettingsTable();

    },

    /**
    * Takes global variable payload.suitability.csv and parses that out to render it to a table
    */
    renderSuitabilitySettingsTable: function () {
      var settings = payload && payload.suitability && payload.suitability.csv,
          content = "<table><thead><tr>",
          settingsArray,
          headerRow,
          table,
          label,
          value,
          data;

      if (settings) {
        // Split the string by newline settings, splice the csv content and leave the header separate
        table = settings.split('\n');
        settingsArray = table.splice(1);
        headerRow = table[0].split(',');

        content += '<th>Parameter</th><th>Setting</th></tr></thead><tbody>';

        arrayUtils.forEach(settingsArray, function (setting) {
          data = setting.split(',');
          label = data[0];
          value = data[1];
          if (label !== undefined && label !== '') {
            content += '<tr><td>' + label + '</td><td>' + value.replace(/\;/g,',') + '</td></tr>';
          }
        });

        content += '</tbody></table>';

        $('#suitability-settings-table').html(content);

      }

    },

    /**
    * @param {object} results - array of result objects containing suitable & unsuitable pixel counts and a label
    */
    renderSuitabilityCompositionChart: function (results) {
      var unsuitableValues = [],
          suitableValues = [],
          labels = [],
          tempTotal;

      // Format the results into two arrays, one of labels and one of percentages
      // First calcualte the percentages, sort the array, then create the two arrays
      arrayUtils.forEach(results, function (result) {
        tempTotal = result.suitable + result.unsuitable;
        result.suitable = (result.suitable / tempTotal) * 100;
        // These values need to be negative so multiply by negative 1 to invert the values
        result.unsuitable = ((result.unsuitable / tempTotal) * 100) * -1;
      });

      // Sort them based on the highest percentage of suitability, strangely highcharts is reversing them
      // for this particular chart, below puts least suitable on top so when highcharts reverses it, it
      // renders the most suitable on top
      results.sort(function (a, b) {
        if (a.suitable > b.suitable) return 1;
        if (b.suitable > a.suitable) return -1;
        return 0;
      });

      arrayUtils.forEach(results, function (result) {
        unsuitableValues.push(result.unsuitable);
        suitableValues.push(result.suitable);
        labels.push(result.label);
      });

      // Now Create the Chart, the dom node to insert it into is suitability-composition-analysis
      $('#suitability-composition-analysis').highcharts({
        chart: { type: 'bar' },
        title: { text: 'Suitability Composition Analysis' },
        colors: ['#FDD023','#461D7C'],
        credits: { enabled: false },
        xAxis: [{
          categories: labels,
          reversed: false
        }, {
          labels: {
            enabled: false
          },
          opposite: true,
          reversed: false,
          linkedTo: 0,  // Link to the first axis so it takes the same min and max
          //minorTickLength: 0
          tickLength: 0
        }],
        yAxis: {
          title: {
            text: null
          },
          min: -100,
          max: 100,
          labels: {
            formatter: function () {
              return Math.abs(this.value) + (this.value !== 0 ? '%' : '');
            }
          }
        },
        tooltip: {
          formatter: function () {
            return (
              '<b>' + this.point.category + '</b><br/>' +
              '<b>' + this.series.name + ':</b>\t' + Highcharts.numberFormat(Math.abs(this.point.y), 2) + '%'
            );
          }
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        series: [{
          name: 'Unsuitable',
          data: unsuitableValues
        }, {
          name: 'Suitable',
          data: suitableValues
        }],
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
            }
          }
        }
      });

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
          text: chartConfig.title
        },
        tooltip: {
          valueSuffix: ''
        },
        exporting: {
          buttons: {
            contextButton: { enabled: false },
            exportButton: {
              menuItems: Highcharts.getOptions().exporting.buttons.contextButton.menuItems,
              symbol: exportButtonImagePath
            }
          }
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
          content = "",
          title;

      arrayUtils.forEach(mills, function (mill, index) {
        // Create Header, if mill_name exits, use that, else, loop over report.mills and find a
        // matching id and use that
        content = "";

        if (mill.mill_name) {
          title = mill.mill_name;
        } else if (report.mills) {
          arrayUtils.some(report.mills, function (millAttrs) {
            if (mill.id === millAttrs.millId) {
              title = millAttrs.label;
              return true;
            }
          });
        }

        if (title === undefined) {
          title = window.payload.title;
        }

        // Group Mill Results table if more then one mill
        if(mills.length > 1 && index == 0) {
          // Table header
          content += "<table class='mill-table-v2'><thead class='mill-table-header-v2'><tr><td class='dark' rowspan='2'></td><td class='dark' rowspan='2'>Overall Priority Level</td><td class='dark' rowspan='2'>Historic Loss</td><td class='dark' rowspan='2'>Future Potential Loss</td><td class='white span-60' colspan='6'>Environmental Indicators</td></tr>" +
            "<tr><td class='white'>Tree Cover</td><td class='white'>Primary Forest</td><td class='white'>Peat</td><td class='white'>Protected Areas</td><td class='white'>Carbon</td><td class='white'>Fires</td></tr></thead>";

          // Table body
          content += "<tbody class='mill-table-container-v2'>";
          for (var element = 0; element < mills.length; element++) {
            content += generateGroupMillRow(mills[element]);
          }

        }

        //Single Mill Result
        content += generateSingleMillTableTop(mills[index]);
        content += generateSingleMillTableBottom(mills[index]);

        millTables.push(content);

      });

      /**
        @param {string} name - Represents Name in table row
        @param {object} data - Represents segment of response
        @param {string} parentClass - (OPTIONAL) - class of parent and child
        @param {string} childClass - (OPTIONAL) - class of child, same as parent
        @return String - HTML Fragment which is a <tr>
      */
      function generateChildRow(name, data, childClass) {
        // If child is to be open by default, add open class below if parentClass is defined,
        // so data-row parent open are all in if parentClass is defined
        var rowClass = 'data-row' + (childClass ? ' child ' + childClass : '');
        var frag = "<tr class='" + rowClass + "'><td class='row-name'><span>" + name + "</span></td>";
        frag += "<td class='" + data.concession.risk + "'><span class='large-swatch'></span><span class='risk-label'>" + data.concession.risk + "</span></td>";
        // frag += "<td>" + data.concession.raw + "</td>";
        frag += "<td class='" + data.radius.risk + "'><span class='large-swatch'></span><span class='risk-label'>" + data.radius.risk + "</span></td>";
        // frag += "<td>" + data.radius.raw + "</td>";
        frag += "</tr>";
        return frag;
      }

      /**
        @param {string} name - Represents Name in table row
        @param {object} data - Represents segment of response
        @param {string} parentClass - class of parent and child
        @param {string} fieldPrefix - prefix for field name in the json to extract data from
        @return String - HTML Fragment which is a <tr>
      */
      // function generateParentRow(name, data, className, fieldPrefix) {
      //   var rowClass = 'data-row parent';
      //   var frag = "<tr class='" + rowClass + "' data-class='" + className + "'><td class='row-name'>" +
      //              "<span class='toggle-icon'></span><span>" + name + "</span></td>";
      //
      //   frag += "<td class='" + (data[fieldPrefix + '_concession'] || 'N/A') + "'><span class='large-swatch'></span><span class='risk-label'>" + (data[fieldPrefix + '_concession'] || 'N/A') + "</span></td>";
      //   frag += "<td class='" + (data[fieldPrefix + '_radius'] || 'N/A') + "'><span class='large-swatch'></span><span class='risk-label'>" + (data[fieldPrefix + '_radius'] || 'N/A') + "</span></td>";
      //   frag += "</tr>";
      //
      //   return frag;
      // }

      /**
        @param {string} name - Represents Name in table row
        @param {object} data - Represents segment of response
        @param {string} fieldPrefix - field prefix in the json to extract data from
          - some json values are nested in objects, if no fieldName is provided, this function assumes thats the case
        @return String - HTML Fragment which is a <tr>
      */
      // function generateBasicRow(name, data, fieldPrefix) {
      //   var frag = "<tr class='data-row'><td class='row-name'><span>" + name + "</span></td>";
      //   var concession = (fieldPrefix ? data[fieldPrefix + '_concession'] : data.concession.risk);
      //   var radius = (fieldPrefix ? data[fieldPrefix + '_radius'] : data.radius.risk);
      //
      //   frag += "<td class='" + concession + "'><span class='large-swatch'></span><span class='risk-label'>" + concession + "</span></td>";
      //   frag += "<td class='" + radius + "'><span class='large-swatch'></span><span class='risk-label'>" + radius + "</span></td>";
      //   frag += "</tr>";
      //
      //   return frag;
      // }

      /**
        @param {object} mill - Represents segment of response
        @return String - HTML Fragment which is <tr>
      */
      function generateGroupMillRow(mill) {
        var smallSwatch = "'><span class='small-swatch'></span>";

        var frag  = "<tr class='data-row'>";
            frag += "<td class='mill_name'><span>" + mill.mill_name + "</span></td>";
            frag += "<td class='" + mill.priority_level + smallSwatch + mill.priority_level + "</td>";
            frag += "<td class='" + mill.historic_loss + smallSwatch + mill.historic_loss + "</td>";
            frag += "<td class='" + mill.future_risk + smallSwatch + mill.future_risk + "</td>";
            frag += "<td class='" + mill.tree_cover.risk + smallSwatch + mill.tree_cover.risk + "</td>";
            frag += "<td class='" + mill.primary_forest.risk + smallSwatch + mill.primary_forest.risk + "</td>";
            frag += "<td class='" + mill.peat.risk + smallSwatch + mill.peat.risk + "</td>";
            frag += "<td class='" + mill.protected_areas.risk + smallSwatch + mill.protected_areas.risk + "</td>";
            frag += "<td class='" + mill.carbon.risk + smallSwatch + mill.carbon.risk + "</td>";
            frag += "<td class='" + mill.fire.risk + smallSwatch + mill.fire.risk + "</td>";
            frag += "</tr>";

        return frag;
      }

      /**
       @param {object} mill - Represents segment of response
       @return String - HTML Fragment which is <div> and <table>
      */
      function generateSingleMillTableTop(mill) {
        var smallSwatch = "'><span class='small-swatch'></span>";
        var millName = mill.mill_name ? mill.mill_name : 'Unknown';

        var className;

        if (mill.priority_level === 'low') {
          className = 'low';
        } else if (mill.priority_level === 'medium low') {
          className = 'medium-low';
        } else if (mill.priority_level === 'medium') {
          className = 'low';
        } else if (mill.priority_level === 'medium high') {
          className = 'medium-high';
        } else {
          className = 'high';
        }

        // var frag = '<div class="mill-header-single-title"><span class="mill-title">' + millName + '</span><span class="mill-risk-level-single-title medium"><span class="large-swatch"></span>Mill Priority: <span class="overall-risk">' + mill.priority_level + '</span></span></div>';
        var frag = "<table class='single-mill-table-header-v2'>";
        // frag += "<table class='single-mill-table-header-v2'>";
            // frag += "<tr class='single-mill-header'><th colspan='4'><span class='title'>" + millName + "</span></th><th colspan='4'><span class='title medium overall-risk'>Mill Priority: " + mill.priority_level + "</span></th></tr>";
            frag += "<tr class='single-mill-header'><div class='mill-header-single-title'><span class='mill-title'>Mill Name: " + millName + "</span><span class='mill-risk-level-single-title " + className + "'>Mill Priority: <span class='overall-risk'>" + mill.priority_level + "</span></div></tr>";

            frag += "<tr class=''>";
            frag += "<tr><th>Combined Indicator</th><th>Rank </th><th>Combined Indicator</th><th>Rank </th></tr>";
            frag += "<tr><td>Tree cover</td><td class='" + mill.tree_cover.risk + smallSwatch + mill.tree_cover.risk + "</td><td>Protected Areas</td><td class='" + mill.protected_areas.risk + smallSwatch + mill.protected_areas.risk + "</td></tr>";
            frag += "<tr><td>Primary Forest</td><td class='" + mill.primary_forest.risk + smallSwatch + mill.primary_forest.risk + "</td><td>Carbon</td><td class='" + mill.carbon.risk + smallSwatch + mill.carbon.risk + "</td></tr>";
            frag += "<tr><td>Peat</td><td class='" + mill.peat.risk + smallSwatch + mill.peat.risk + "</td><td>Fire</td><td class='" + mill.fire.risk + smallSwatch + mill.fire.risk + "</td></tr>";
            frag += "</tr>";
            frag += "</table>";

        return frag;
      }

      /**
       @param {object} mill - Represents segment of response
       @return String - HTML Fragment which is <table>
      */
      function generateSingleMillTableBottom(mill) {
        var smallSwatch = '"><span class="small-swatch"></span>';

        var frag = '<table class="single-mill-table-content-v2">';
            frag += '<thead><tr><th colspan="3" class="' + mill.historic_loss + '">Historic loss: <span class="small-swatch"></span>' + mill.historic_loss + ' Risk</th>' +
                    '<th colspan="3" class="' + mill.future_risk + '">Potential for future loss:  <span class="small-swatch"></span>' + mill.future_risk + ' Risk</th></tr>';
            frag += '<tr><td>Indicator</td><td>Rank</td><td>Amount</td><td>Indicator</td><td>Rank</td><td>Amount</td></tr></thead>';
            frag += '<tr><td>Rate of tree cover loss</td><td class="' + mill.tree_cover.loss.rank + smallSwatch + mill.tree_cover.loss.rank + '</td><td>' + Math.round(mill.tree_cover.loss.amount) + ' ha/year</td>' +
                    '<td>Rate of tree cover loss</td><td class="' + mill.tree_cover.extent.rank + smallSwatch + mill.tree_cover.extent.rank + '</td><td>' + Math.round(mill.tree_cover.extent.amount) + ' ha/year</td></tr>';
            frag += '<tr><td>Tree cover loss on primary forest</td><td class="' + mill.primary_forest.loss.rank + smallSwatch + mill.primary_forest.loss.rank + '</td><td>' + Math.round(mill.primary_forest.loss.amount) + ' ha</td>' +
                    '<td>Area in primary forest</td><td class="' + mill.primary_forest.extent.rank + smallSwatch + mill.primary_forest.extent.rank + '</td><td>' + Math.round(mill.primary_forest.extent.amount) + '%</td></tr>';
            frag += '<tr><td>Tree cover loss on peat</td><td class="' + mill.peat.loss.rank + smallSwatch + mill.peat.loss.rank + '</td><td>' + Math.round(mill.peat.loss.amount) + ' ha</td>' +
                    '<td>Area in peat</td><td class="' + mill.peat.extent.rank + smallSwatch + mill.peat.extent.rank + '</td><td>' + Math.round(mill.peat.extent.amount) + '%</td></tr>';
            frag += '<tr><td>Tree cover loss on protected areas</td><td class="' + mill.protected_areas.loss.rank + smallSwatch + mill.protected_areas.loss.rank + '</td><td>' + Math.round(mill.protected_areas.loss.amount) + ' ha</td>' +
                    '<td>Area in protected areas</td><td class="' + mill.protected_areas.extent.rank + smallSwatch + mill.protected_areas.extent.rank + '</td><td>' + Math.round(mill.protected_areas.extent.amount) + '%</td></tr>';
            frag += '<tr><td>Tree cover loss on carbon dense areas</td><td class="' + mill.carbon.loss.rank + smallSwatch + mill.carbon.loss.rank + '</td><td>' + Math.round(mill.carbon.loss.amount) + ' ha</td>' +
                    '<td>Area of high carbon density</td><td class="' + mill.carbon.extent.rank + smallSwatch + mill.carbon.extent.rank + '</td><td>' + Math.round(mill.carbon.extent.amount) + '%</td></tr>';
            frag += '<tr><td>Fire activity</td><td class="' + mill.fire.loss.rank + smallSwatch + mill.fire.loss.rank + '</td><td>' + mill.fire.loss.amount.toFixed(5) + ' fires/ha/year</td>' +
                    '<td>Rate of fire activity last two years</td><td class="' + mill.fire.extent.rank + smallSwatch + mill.fire.extent.rank + '</td><td>' + mill.fire.extent.amount.toFixed(5) + ' fires/ha/year</td></tr>';
            frag += '</table>';

        return frag;
      }


      // Add the Content, can add headerContent before millTables if we want toggle switch for raw values
      // currently the API removed raw values so we don't support it
      document.getElementById(config.rootNode + "_table").innerHTML = millTables.join('<br />');

      // Toggle Functions
      /*
        Toggle Values Columns and and set colspan to correct values for all rows
      */
      // function toggleValues() {
      //  var node = $(".toggle-button-container"),
      //      colspan = node.hasClass('active') ? 2 : 1;
      //  // Toggle the active class
      //  node.toggleClass('active');
      //  // Update the look of the table
      //  $('.mill-table-container tr.data-row td:nth-child(3)').toggle();
      //  $('.mill-table-container tr.data-row td:nth-child(5)').toggle();
      //  $('.mill-table-container tr.data-row td:nth-child(2)').attr('colspan', colspan);
      //  $('.mill-table-container tr.data-row td:nth-child(4)').attr('colspan', colspan);
      // }

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
      $(".mill-table-container tr.parent").click(toggleChildren);
      $(".mill-table-container .info-icon").click(this.showMillPointInfo);
      $('#mill-download').click(function () {
        // Pass in the mills and an array of descriptors for the CSV format
        var csvData = CSVExporter.prepareMillAnalysis(mills, ReportConfig.millCSVDescriptor);
        CSVExporter.exportCSV(csvData);
      });

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
        msg = "No tree cover loss detected.";
      } else if (type === 'clearance') {
        msg = "No clearance alerts occured in this area.";
      } else if (type === 'composition') {
        msg = config.errors && config.errors.composition || "No Composition Analysis Data Available for this site.";
      } else if (type === 'prodes') {
        msg = 'No data available for this site.';
      } else {
        msg = "No data available for this site.";
      }

      if (node) {
        node.innerHTML = msg;
      }
    }

  };

});
