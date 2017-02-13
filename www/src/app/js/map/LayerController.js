define([

    'map/config',
    'map/MapModel',
    'dojo/on',
    'dojo/dom',
    'dojo/query',
    'dojo/topic',
    'dojo/dom-class',
    'dojo/dom-style',
    'dijit/registry',
    'dojo/_base/array',
    'utils/Hasher',
    'utils/Analytics',
    'esri/InfoTemplate',
    'esri/graphic',
    'esri/graphicsUtils',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/layers/RasterFunction',
    'esri/layers/LayerDrawingOptions'
], function (MapConfig, MapModel, on, dom, dojoQuery, topic, domClass, domStyle, registry, arrayUtils, Hasher, Analytics, InfoTemplate, Graphic, graphicsUtils, esriQuery, QueryTask, RasterFunction, LayerDrawingOptions) {

    return {

        // Called From Delegator or internally, layerConfig is in the Map Config
        // This function should only show or hide layers
        toggleLayers: function(layerConfig) {
          var layer = app.map.getLayer(layerConfig.id);
          // The WDPA or pal layer has a helper layer it needs to manage
          // offload that functionality to a different function
          if (layerConfig.id === MapConfig.pal.id) {
              this.updateZoomDependentLayer(layerConfig, MapConfig.palHelper, 6);
              return;
          }

          if (layerConfig.id === MapConfig.gain.id) {
              this.updateZoomDependentLayer(layerConfig, MapConfig.gainHelper, 13);
              return;
          }

          // For the customSuitability Layer, It has to make a request to the server for a url for the image
          // and then load the image, show a loading wheel as this can be slow at times
          if (layerConfig.id === MapConfig.suit.id) {
              this.showSuitabilityLoader();
              // We also want to track this layer and not a lot of others for now
              var message = 'User toggled Custom Suitabiltiy Layer ' + (layer.visible ? 'off.' : 'on.');
              Analytics.sendEvent('Event', 'Layer', message);
          }
          if (layer) {
              layer.setVisibility(!layer.visible);
              this.refreshLegendWidget();
          }
        },

        // Called From Delegator or internally, props is coming from a click event on the layer UI.
        // Can see the props in MapConfig.layerUI
        // This function should update dynamic layers but is called from checkboxes in the UI
        // and not radio buttons, which is why it has it's own function and cannot use updateDynamicLayer,
        // This queries other checkboxes in the same layer to find out which needs to be added to visible layers
        updateLayer: function(props) {
            var conf = MapConfig[props.id],
                layer = app.map.getLayer(conf.id),
                queryClass = props.filter,
                visibleLayers = [],
                itemLayer,
                itemConf,
                status,
                value;

            dojoQuery('.gfw .filter-list .' + queryClass).forEach(function(node) {
                itemLayer = node.dataset ? node.dataset.layer : node.getAttribute('data-layer');
                itemConf = MapConfig[itemLayer];
                if (itemConf) {

                    if (itemConf.id === layer.id && domClass.contains(node, 'active')) {
                        visibleLayers.push(itemConf.layerId);
                    }
                }
            });

            if (layer) {

                if (visibleLayers.length > 0) {
                    layer.setVisibleLayers(visibleLayers);
                    layer.show();
                } else {
                    layer.hide();
                }
                this.refreshLegendWidget();
            }

            // If layer is a mill point, update definition query
            if (conf.layerId == '27') {
                var millChecked = domClass.contains(dom.byId('mill_checkbox').parentElement, 'active'),
                    gfwMillChecked = domClass.contains(dom.byId('gfwMill_checkbox').parentElement, 'active'),
                    layerDefinitions = [],
                    definitionQueries = [];

                if (millChecked) {definitionQueries.push(MapConfig.mill.query);}
                if (gfwMillChecked) {definitionQueries.push(MapConfig.gfwMill.query);}

                layerDefinitions[27] = definitionQueries.join(' OR ');
                app.map.getLayer(conf.id).setLayerDefinitions(layerDefinitions);
                app.map.getLayer(conf.id).refresh();
            }

            // We only want to apply analytics to a few layers for now, catch those here
            // As they add more layers we can find a better way to catch this, possibly higher
            // up in the callstack so one function can catch all and this becomes less messy
            // may also want to add descriptive content to layer config
            status = arrayUtils.indexOf(visibleLayers, conf.layerId) > -1 ? 'on.' : 'off.';

            switch (conf) {
              case MapConfig.oilPerm:
                value = 'User toggled Oil Palm Concessions layer ' + status;
                Analytics.sendEvent('Event', 'Layer', value);
              break;
              case MapConfig.rspoPerm:
                value = 'User toggled RSPO Oil Palm Concessions layer ' + status;
                Analytics.sendEvent('Event', 'Layer', value);
              break;
              case MapConfig.mill:
                value = 'User toggled RSPO Mills layer ' + status;
                Analytics.sendEvent('Event', 'Layer', value);
              break;
            }

        },
        // Called From Delegator or internally, layerConfig is in the Map Config
        // This function should only show layers

        showLayer: function(layerConfig) {
            var layer = app.map.getLayer(layerConfig.id);
            if (layerConfig.layerId !== undefined) {
                this.updateDynamicLayer(layerConfig);
                return;
            }

            if (layer) {
                if (!layer.visible) {
                    layer.show();
                    this.refreshLegendWidget();
                }
            }
        },

        // Called From Delegator or internally, layerConfig is in the Map Config
        // This function should only hide layers, helper for hiding children
        hideLayer: function(layerConfig) {
            var layer = app.map.getLayer(layerConfig.id);

            if (layer) {
                if (layer.visible) {
                    if (layer.visibleLayers) {
                        if (layer.visibleLayers.length > 1 && layerConfig.layerId) {
                            var index = layer.visibleLayers.indexOf(layerConfig.layerId);
                            layer.visibleLayers.splice(index, 1);
                            layer.setVisibleLayers(layer.visibleLayers);
                        } else {
                            layer.hide();
                        }
                    } else {
                        layer.hide();
                    }


                    this.refreshLegendWidget();
                }
            }
        },

        // Updates a dynamic layer controlled by a radio button so it simply changes the visible layers
        // to the one tied to the radio button, no need to have multiple sublayers turned on, if you do need
        // that, look at updateLayer function instead or create a new one as that one is tied to the checkboxes
        updateDynamicLayer: function(layerConfig) {
            var layer = app.map.getLayer(layerConfig.id),
                visibleLayers = [];
            if (layer) {
                visibleLayers.push(layerConfig.layerId);
                layer.setVisibleLayers(visibleLayers);
                layer.show();
                this.refreshLegendWidget();
            }
        },

        parseDate: function (str) {
          var mdy = str.split('/');
          return new Date(mdy[2], mdy[0] - 1, mdy[1]);
        },

        daydiff: function (first, second) {
          return Math.round((second - first) / (1000 * 60 * 60 * 24)) + 1;
        },

        isLeapYear: function (year) {
          if((year & 3) !== 0) {
              return false;
          }
          return ((year % 100) !== 0 || (year % 400) === 0);
        },

        updateGuyraDates: function(clauseArray) {
          var start = clauseArray[0];
          var end = clauseArray[1];

          var guyraLayer = app.map.getLayer('granChaco');
          var layerDefs = [];
          var where = "date >= '" + start.toDateString() + "' AND date <= '" + end.toDateString() + "'";
          layerDefs[0] = where;
          guyraLayer.setLayerDefinitions(layerDefs);
        },

        updateGladDates: function(clauseArray) {
          var gladLayer = app.map.getLayer('gladAlerts');

          var startDate = new Date(clauseArray[0]);
          var endDate = new Date(clauseArray[1]);

          var julianFrom = this.getJulianDate(startDate);
          var julianTo = this.getJulianDate(endDate);

          if (gladLayer) {
            gladLayer.setDateRange(julianFrom, julianTo);
          }

        },

        toggleGladConfidence: function(active) {
          var gladLayer = app.map.getLayer('gladAlerts');
          if (active) {
            gladLayer.setConfidenceLevel('all');
          } else {
            gladLayer.setConfidenceLevel('confirmed');
          }

        },

        updateHansenDates: function(clauseArray) {
          var hansenLossLayer = app.map.getLayer('hansenLoss');

          if (hansenLossLayer) {
            hansenLossLayer.setDateRange(clauseArray[0], clauseArray[1]);
          }

        },

        getJulianDate: function(timestamp) {
          var day = 1000 * 60 * 60 * 24;
          var newDate = new Date(timestamp);
          var year = new Date(newDate.getFullYear(), 0, 0);
          var currentDay = Math.ceil((newDate - year) / day);
          //- Year should be 15000 or 16000
          var julianYear = (newDate.getFullYear() - 2000) * 1000;
          return julianYear + currentDay;
        },

        setWizardDynamicLayerDefinition: function(config, filter) {
            var layer = app.map.getLayer(config.id),
                layerDefs = [],
                where;

            if (layer) {
                if (filter !== undefined) {
                    where = config.whereField + " = '" + filter + "'";
                    layerDefs[config.layerId] = where;
                    layer.setVisibleLayers([config.layerId], true);
                    layer.setLayerDefinitions(layerDefs);
                    layer.show();
                } else {
                    layer.hide();
                }
                this.refreshLegendWidget();
            }
        },

        setWizardMillPointsLayerDefinition: function(config) {
            // Option for Layer Definitions will come soon,
            // for now, just toggle the layer
            var layer = app.map.getLayer(config.id);
            if (layer) {
                if (layer.visible) {
                    layer.hide();
                } else {
                    layer.show();
                }
            }
        },

        setFiresLayerDefinition: function(filter, highConfidence) {
            var time = new Date(),
                layerDefs = [],
                visibleLayers,
                dateString,
                layer,
                where;

            layer = app.map.getLayer(MapConfig.fires.id);

            // 1*filter essentially casts as a number
            time.setDate(time.getDate() - (1 * filter));

            dateString = time.getFullYear() + "-" +
                (time.getMonth() + 1) + "-" +
                time.getDate() + " " + time.getHours() + ":" +
                time.getMinutes() + ":" + time.getSeconds();

            // Set up Layer defs based on the filter value, if filter = 7, just set where to 1 = 1
            where = (filter !== "7" ? "ACQ_DATE > date '" + dateString + "'" : "1 = 1");
            for (var i = 0, length = MapConfig.fires.defaultLayers.length; i < length; i++) {
                layerDefs[i] = where;
            }

            if (layer) {
                // Set up and update Visible Layers if they need to be updated
                visibleLayers = (highConfidence ? [0, 1] : [0, 1, 2, 3]);
                if (layer.visibleLayers.length !== visibleLayers.length) {
                    layer.setVisibleLayers(visibleLayers);
                }

                layer.setLayerDefinitions(layerDefs);
                this.refreshLegendWidget();
            }
        },

        setOverlaysVisibleLayers: function() {
            var visibleLayers = [],
                layer,
                key;

            for (var key in app.map._simpleLegends) {
                app.map._simpleLegends[key].hide();
            }

            // Layer Ids are in the config, the key to the config file is under the data-layer attribute of the elements
            dojoQuery(".gfw .overlays-container .overlays-checkbox.selected").forEach(function(node) {
                key = node.dataset ? node.dataset.layer : node.getAttribute("data-layer");
                visibleLayers.push(MapConfig[key].layerId);
                if (app.map._simpleLegends[key]) app.map._simpleLegends[key].show();
            });

            layer = app.map.getLayer(MapConfig.overlays.id);
            if (layer) {
                if (visibleLayers.length === 0) {
                    visibleLayers.push(-1);
                    layer.hide();
                } else {
                    layer.show();
                }
                layer.setVisibleLayers(visibleLayers);
                this.refreshLegendWidget();
            }

        },

        updateLossImageServiceRasterFunction: function(values, layerConfig, densityRange) {

            var layer = app.map.getLayer(layerConfig.id),
                outRange = [1],
                rasterFunction,
                range;

            if (layer) {
                // range = values[0] === values[1] ? [values[0] + 1, values[1] + 1] : [values[0] + 1, values[1] + 2];
                range = [values[0] + 2001, values[1] + 2001];
                rasterFunction = this.getColormapLossRasterFunction(layerConfig.colormap, range, outRange, densityRange);
                layer.setRenderingRule(rasterFunction);
            }

        },

        updateImageServiceRasterFunction: function(values, layerConfig) {

            var layer = app.map.getLayer(layerConfig.id),
                outRange = [1],
                rasterFunction,
                range;

            if (layer) {
              // For Forma updates, if its a single range, we need to remap 1 to 0
              // Values in slider are from a 0 based index, the range starts at 1
              // so we need to shift the values by 1 to have correct range
              // Also the rule is [inclusive, exclusive], so if values are 3,3 use 4,4
              // if they are 3,4 then use 4,6
              if (layerConfig.id === 'FormaAlerts') {
                  var finalValue = (values[0] === values[1] ? values[1] + 1 : values[1] + 2);
                  range = [1, 1, values[0] + 1, finalValue];
                  outRange = [0, 1];
              } else if (layerConfig.id === 'gladAlerts') {
                // debugger
              } else {
                  range = values[0] === values[1] ? [values[0] + 1, values[1] + 1] : [values[0] + 1, values[1] + 2];
              }

              rasterFunction = this.getColormapRasterFunction(layerConfig.colormap, range, outRange);
              layer.setRenderingRule(rasterFunction);

            }
        },

        updateTCDRenderingRule: function (newInputValue) {
          var config = MapConfig.tcd,
              colormap = config.colormap,
              output = config.outputValue,
              input = [newInputValue, 101],
              layer;

          layer = app.map.getLayer(config.id);

          if (layer) {
            layer.setRenderingRule(this.getColormapRasterFunction(colormap, input, output));
          }

        },

        getColormapLossRasterFunction: function(colormap, range, outRange, densityRange) {
            return new RasterFunction({
                // 'rasterFunction': 'Colormap',
                // 'rasterFunctionArguments': {
                //     'Colormap': colormap,
                //     'Raster': {
                //         'rasterFunction': 'ForestCover_lossyear_density',
                //         'rasterFunctionArguments': {
                //             'min_year': range[0],
                //             'max_year': range[1],
                //             'min_density': densityRange[0],
                //             'max_density': densityRange[1]
                //         }
                //     }
                // },
                // 'variableName': 'Raster'
                'rasterFunction': 'ForestCover_lossyear_density',
                'rasterFunctionArguments': {
                    'min_year': range[0],
                    'max_year': range[1],
                    'min_density': densityRange[0],
                    'max_density': densityRange[1]
                }
            });
        },

        getColormapRasterFunction: function(colormap, range, outRange) {

            return new RasterFunction({
                'rasterFunction': 'Colormap',
                'rasterFunctionArguments': {
                    'Colormap': colormap,
                    'Raster': {
                        'rasterFunction': 'Remap',
                        'rasterFunctionArguments': {
                            'InputRanges': range,
                            'OutputValues': outRange,
                            'AllowUnmatched': false
                        }
                    }
                },
                'variableName': 'Raster'
            });
        },

        updateCustomSuitabilityLayer: function(value, dispatcher) {

            var customLayer = app.map.getLayer(MapConfig.suit.id),
                settings = MapModel.get('suitabilitySettings'),
                activeCheckboxes = [];

            switch (dispatcher) {
                case 'peat-depth-slider':
                    settings.computeBinaryRaster[1].values = this._prepareSuitabilityJSON(0, value);
                    break;
                case 'conservation-area-slider':
                    settings.computeBinaryRaster[3].values = value;
                    break;
                case 'water-resource-slider':
                    settings.computeBinaryRaster[4].values = value;
                    break;
                case 'slope-slider':
                    settings.computeBinaryRaster[2].values = value;
                    break;
                case 'elevation-slider':
                    settings.computeBinaryRaster[5].values = value;
                    break;
                case 'rainfall-slider':
                    settings.computeBinaryRaster[6].values = parseInt(value[0]) + ',' + parseInt(value[1]);
                    break;
                case 'soil-drainage-slider':
                    settings.computeBinaryRaster[7].values = this._prepareSuitabilityJSON(value[0], value[1], [99]);
                    break;
                case 'soil-depth-slider':
                    settings.computeBinaryRaster[8].values = this._prepareSuitabilityJSON(value, 7, [99]);
                    break;
                case 'soil-acid-slider':
                    settings.computeBinaryRaster[9].values = this._prepareSuitabilityJSON(value[0], value[1], [99]);
                    break;
                case 'landcover-checkbox':
                    // Push in all Active Checkboxes values
                    // Need to include Cloud as Suitable, its ID is 11
                    activeCheckboxes.push('11');
                    dojoQuery('#environmental-criteria .suitable-checkbox input:checked').forEach(function(node) {
                        activeCheckboxes.push(node.value);
                    });
                    settings.computeBinaryRaster[0].values = activeCheckboxes.join(',');
                    break;
                case 'soil-type-checkbox':
                    // Need to include default values to represent unknown values
                    activeCheckboxes.push('0');
                    activeCheckboxes.push('6');
                    // Push in all other Active Checkboxes values
                    dojoQuery('#environmental-criteria .suitable-checkbox-soil input:checked').forEach(function(node) {
                        activeCheckboxes.push(node.value);
                    });
                    //console.log("****************** soil type checkboxes: " + activeCheckboxes.toString());
                    settings.computeBinaryRaster[10].values = activeCheckboxes.join(',');
                    break;
            }


            MapModel.set('suitabilitySettings', settings);

            if (customLayer) {
                customLayer.refresh();
                this.showSuitabilityLoader();
            }

        },

        showSuitabilityLoader: function() {
            domClass.remove('suitability_loader', 'hidden');
        },

        hideSuitabilityLoader: function() {
            domClass.add('suitability_loader', 'hidden');
        },

        checkZoomDependentLayers: function(evt) {
            var protectedAreaConfig = MapConfig.pal,
                protectedAreaHelperConfig = MapConfig.palHelper,
                gainLayerConfig = MapConfig.gain,
                gainHelperConfig = MapConfig.gainHelper;

            this.toggleZoomDependentLayer(evt, protectedAreaConfig, protectedAreaHelperConfig, 6);
            this.toggleZoomDependentLayer(evt, gainLayerConfig, gainHelperConfig, 13);
        },

        toggleZoomDependentLayer: function(evt, tiledConfig, helperConfig, level) {
            var helperLayer,
                mainLayer;

            helperLayer = app.map.getLayer(helperConfig.id);
            mainLayer = app.map.getLayer(tiledConfig.id);

            if (mainLayer === undefined || helperLayer === undefined) {
                // Error Loading Layers and they do not work
                return;
            }

            if (!mainLayer.visible && !helperLayer.visible) {
                return;
            }

            if (app.map.getLevel() > level) {
                if (helperConfig.layerId) {
                  helperLayer.setVisibleLayers([helperConfig.layerId]);
                }
                helperLayer.show();
                mainLayer.hide();
            } else {
                helperLayer.hide();
                mainLayer.show();
            }

        },

        updateZoomDependentLayer: function(layerConfig, helperConfig, level) {
            var helperLayer,
                mainLayer;

            helperLayer = app.map.getLayer(helperConfig.id);
            mainLayer = app.map.getLayer(layerConfig.id);

            if (mainLayer === undefined || helperLayer === undefined) {
                // Error Loading Layers and they do not work
                return;
            }

            if (mainLayer.visible || helperLayer.visible) {
                helperLayer.hide();
                mainLayer.hide();
            } else {
                if (app.map.getLevel() > level) {
                    helperLayer.show();
                } else {
                    mainLayer.show();
                }
            }

            this.refreshLegendWidget();

        },

        refreshLegendWidget: function() {
            var legendLayer = app.map.getLayer(MapConfig.legendLayer.id),
                densityConf = MapConfig.tcd,
                formaConf = MapConfig.forma,
                gladConf = MapConfig.gladAlerts,
                lossConf = MapConfig.loss,
                gainConf = MapConfig.gain,
                prodesConf = MapConfig.prodes,
                biomassConf = MapConfig.tfcs,
                primForConf = MapConfig.primForest,
                suitConf = MapConfig.suit,
                soyConfig = MapConfig.soy,
                confItems = [densityConf, formaConf, gladConf, lossConf, gainConf, prodesConf, biomassConf, primForConf, suitConf, soyConfig],
                visibleLayers = [],
                layerOptions = [],
                layer,
                ldos;

                // console.log(legendLayer);

            // Check Tree Cover Density, Tree Cover Loss, Tree Cover Gain, GLAD, and FORMA Alerts visibility,
            // If they are visible, show them in the legend by adding their ids to visibleLayers.
            // Make sure to set layer drawing options for those values so they do not display
            // over their ImageService counterparts

            ldos = new LayerDrawingOptions();
            ldos.transparency = 100;

            arrayUtils.forEach(confItems, function(item) {
                layer = app.map.getLayer(item.id);
                if (layer) {
                    if (layer.visible) {
                        visibleLayers.push(item.legendLayerId);
                        layerOptions[item.legendLayerId] = ldos;
                    }
                }
            });

            if (legendLayer) {
              if (visibleLayers.length > 0) {
                  legendLayer.setVisibleLayers(visibleLayers);
                  legendLayer.setLayerDrawingOptions(layerOptions);
                  if (!legendLayer.visible) {
                      legendLayer.show();
                  }
              } else {
                  legendLayer.hide();
              }
              registry.byId('legend').refresh();
            }

        },

        changeLayerTransparency: function(layerConfig, layerType, transparency) {
            switch (layerType) {
                case 'image':
                    this.setLayerOpacity(layerConfig, transparency);
                    break;
                case 'dynamic':
                    this.setDynamicLayerTransparency(layerConfig, transparency);
                    break;
                case 'tiled':
                    this.setLayerOpacity(layerConfig, transparency);
                    break;
            }
        },

        setLayerOpacity: function(layerConfig, transparency) {
            var layer = app.map.getLayer(layerConfig.id);
            if (layer) {
                layer.setOpacity(transparency / 100);
            } else {
                return;
            }
            // Protected Areas Layer has a helper dynamic layer to show closer then zoom level 6
            // So if we are setting transparency for Protected Areas, pass the helper config on to
            // the Set Dynamic Layer Transparency function
            if (layer.id === 'ProtectedAreas') {
                this.setDynamicLayerTransparency(MapConfig.palHelper, transparency);
            }
            if (layer.id === 'Gain') {
                this.setLayerOpacity(MapConfig.gainHelper, transparency);
            }
        },

        setDynamicLayerTransparency: function(layerConfig, transparency) {
            var layer = app.map.getLayer(layerConfig.id),
                layerOptions,
                ldos;

            if (!layer) {
                // If the layer is invalid or missing, just return
                return;
            }

            ldos = new LayerDrawingOptions();
            // 100 is fully transparent, our sliders show 0 as transparent and 100 as opaque
            // Need to flip my transparency value around
            ldos.transparency = 100 - transparency;

            // If layer has layer drawing options, dont overwrite all of them, append to them or overwrite
            // only the relevant layer id
            layerOptions = layer.layerDrawingOptions || [];
            if (layerConfig.layerId !== undefined) {
                layerOptions[layerConfig.layerId] = ldos;

            } else if (layerConfig.defaultLayers) {
                arrayUtils.forEach(layerConfig.defaultLayers, function(layerId) {
                    layerOptions[layerId] = ldos;
                });
            }

            console.log(layerOptions);

            layer.setLayerDrawingOptions(layerOptions);

        },

        /**
         * Focus infowindow & highlight on intiial shared feature
         * @param {object} options
         */
        setSelectedFeature: function(options) {
            var query = new esriQuery(),
                queryTask = new QueryTask(options.url),
                graphic,
                location,
                item;

            // Build query
            query.objectIds = [options.objectId];
            query.outFields = ['*'];
            query.returnGeometry = true;

            // Execute query
            queryTask.execute(query).then(function(response) {
                // If exists response then open infowindow & highlight
                if (response.features && response.features[0]) {
                    // Create graphic for location & infowindow content
                    graphic = new Graphic(response.features[0].geometry, null, response.features[0].attributes, null);
                    graphic.layer = options.layer;

                    location = graphicsUtils.graphicsExtent([graphic]).getCenter();

                    // Format an input for Finder template function
                    item = {
                        feature: graphic,
                        value: graphic.attributes[response.displayFieldName]
                    }

                    // Get template using Finder function
                    graphic = options.templateFunction([item])[0];

                    // Update infowindow
                    app.map.infoWindow.setFeatures([graphic]);
                    app.map.infoWindow.show(location);
                }
            });
        },

        _prepareSuitabilityJSON: function(start, end, extraValues) {
            var result = [];
            for (var i = start; i <= end; i++) {
                result.push(i);
            }
            if (extraValues) {
                result = result.concat(extraValues);
            }
            return result.join(',');
        }

    };


});
