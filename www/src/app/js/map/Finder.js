define([
    "dojo/on",
    "dojo/dom",
    "dojo/Deferred",
    "dojo/promise/all",
    "map/config",
    "map/MapModel",
    "analysis/WizardHelper",
    "utils/AlertsHelper",
    'utils/GeoHelper',
    "esri/graphic",
    "dojo/_base/array",
    "esri/InfoTemplate",
    "esri/geometry/Point",
    "esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters",
    "esri/geometry/webMercatorUtils",
    "esri/symbols/PictureMarkerSymbol"
], function(on, dom, Deferred, all, MapConfig, MapModel, WizardHelper, AlertsHelper, GeoHelper, Graphic, arrayUtils, InfoTemplate, Point, IdentifyTask, IdentifyParameters, webMercatorUtils, PictureSymbol) {
    'use strict';

    // NOTE: Map is available as app.map

    return {

        searchAreaByCoordinates: function() {
            var values = {},
                latitude, longitude,
                invalidValue = false,
                invalidMessage = "You did not enter a valid value.  Please check that your location values are all filled in and nubmers only.",
                symbol = new PictureSymbol('app/css/images/RedStickpin.png', 32, 32),
                attributes = {},
                point,
                graphic,
                getValue = function(value) {
                    if (!invalidValue) {
                        invalidValue = isNaN(parseFloat(value));
                    }
                    return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                };

            // If the DMS Coords View is present, get the appropriate corrdinates and convert them
            if (MapModel.get('showDMSInputs')) {
                values.dlat = getValue(dom.byId('degreesLatInput').value);
                values.mlat = getValue(dom.byId('minutesLatInput').value);
                values.slat = getValue(dom.byId('secondsLatInput').value);
                values.dlon = getValue(dom.byId('degreesLonInput').value);
                values.mlon = getValue(dom.byId('minutesLonInput').value);
                values.slon = getValue(dom.byId('secondsLonInput').value);
                latitude = values.dlat + (values.mlat / 60) + (values.slat / 3600);
                longitude = values.dlon + (values.mlon / 60) + (values.slon / 3600);
            } else { // Else, get LatLong Coordinates and Zoom to them
                latitude = getValue(dom.byId('latitudeInput').value);
                longitude = getValue(dom.byId('longitudeInput').value);
            }

            if (invalidValue) {
                alert(invalidMessage);
            } else {
                attributes.locatorValue = GeoHelper.nextCustomFeatureId();
                attributes.id = 'LOCATOR_' + attributes.locatorValue;
                graphic = GeoHelper.generatePointGraphicFromGeometric(longitude, latitude, attributes);
                // point = webMercatorUtils.geographicToWebMercator(new Point(longitude, latitude));
                // graphic = new Graphic(point, symbol, attributes);
                app.map.graphics.add(graphic);
                app.map.centerAndZoom(graphic.geometry, 7);
                MapModel.set('showClearPinsOption', true);
            }
        },

        performIdentify: function(evt) {
            // If none of the layers we identify on are visible, then return immediately after checks
            var mapPoint = evt.mapPoint,
                deferreds = [],
                features = [],
                self = this,
                helperLayer,
                layer;

            // Clear out Previous Features
            app.map.infoWindow.clearFeatures();


            layer = app.map.getLayer(MapConfig.fires.id);
            if (layer) {
                if (layer.visible) {
                    deferreds.push(self.identifyFires(mapPoint));
                }
            }

            layer = app.map.getLayer(MapConfig.rspoPerm.id);
            if (layer) {
                if (layer.visible) {
                    deferreds.push(self.identifyforestUseCommodities(mapPoint));
                }
            }

            layer = app.map.getLayer(MapConfig.oilPerm.id);
            if (layer) {
                if (layer.visible) {
                    deferreds.push(self.identifyforestUseLandUse(mapPoint));
                }
            }

            helperLayer = app.map.getLayer(MapConfig.palHelper.id);
            layer = app.map.getLayer(MapConfig.pal.id);
            if (layer && helperLayer) {
                if (layer.visible || helperLayer.visible) {
                    deferreds.push(self.identifyWDPA(mapPoint));
                }
            }

            layer = app.map.getLayer(MapConfig.adminUnitsLayer.id);
            if (layer) {
                if (layer.visible) {
                    deferreds.push(self.identifyWizardDynamicLayer(mapPoint));
                }
            }

            layer = app.map.getLayer(MapConfig.biomes.id);
            if (layer && layer.visible) {
              deferreds.push(self.identifyBiomesLayer(mapPoint));
            }

            layer = app.map.getLayer(MapConfig.byType.id);
            if (layer && layer.visible) {
              deferreds.push(self.identifyPlantationsTypeLayer(mapPoint));
            }

            layer = app.map.getLayer(MapConfig.bySpecies.id);
            if (layer && layer.visible) {
              deferreds.push(self.identifyPlantationsSpeciesLayer(mapPoint));
            }

            layer = app.map.getLayer(MapConfig.overlays.id);
            if (layer && layer.visible) {
              deferreds.push(self.identifyOverlaysLayer(mapPoint));
            }

            layer = app.map.getLayer(MapConfig.customGraphicsLayer.id);
            if (layer) {
                if (layer.visible) {
                    deferreds.push(self.getCustomGraphics(evt));
                }
            }

            if (deferreds.length === 0) {
                return;
            }

            // If drawing tools enabled, dont continue
            if (MapModel.get('drawToolsEnabled')) {
                return;
            }

            /*
        featureObject has the following structure properties
        layer - the layer the feature belongs to, current possible values are:
              - Fires, WDPA, Concessions
        features - array of features found by the identify task
      */

            all(deferreds).then(function(featureSets) {
                arrayUtils.forEach(featureSets, function(item) {

                    // if (item) {
                    //     item.features.forEach(function(feature) {
                    //         feature.feature.layer = item.layer;
                    //     });
                    // }
                    console.log(item)
                    console.log(item.layer)

                    switch (item.layer) {

                        case "Fires":
                            features = features.concat(self.setFireTemplates(item.features));
                            break;
                        case "forestUseCommodities":
                            features = features.concat(self.setForestUseCommoditiesTemplates(item.features));
                            break;
                        case "forestUseLandUse":
                            features = features.concat(self.setForestUseLandUseTemplates(item.features));
                            break;
                        case "WDPA":
                            features = features.concat(self.setWDPATemplates(item.features));
                            break;
                        case "byType":
                            features = features.concat(self.setPlantationsTypeTemplates(item.features));
                            break;
                        case "bySpecies":
                            features = features.concat(self.setPlantationsSpeciesTemplates(item.features));
                            break;
                        case "overlays":
                            features = features.concat(self.setOverlaysTemplates(item.features));
                            break;
                        // case "Concessions":
                        //     features = features.concat(self.setConcessionTemplates(item.features));
                        //     break;
                        case "WizardDynamic":
                            features = features.concat(self.setWizardTemplates(item.features));
                            break;
                        case "CustomGraphics":
                            // This will only contain a single feature and return a single feature
                            // instead of an array of features
                            features.push(self.setCustomGraphicTemplates(item.feature));
                            break;
                        case "Biomes":
                            features = features.concat(self.setBiomesTemplates(item.features));
                            break;
                        default: // Do Nothing
                            break;
                    }
                });

                if (features.length > 0) {
                    app.map.infoWindow.setFeatures(features);
                    app.map.infoWindow.show(mapPoint);
                }

            });


        },

        identifyFires: function(mapPoint) {
            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.fires.url),
                params = new IdentifyParameters();

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = app.map.width;
            params.height = app.map.height;
            params.geometry = mapPoint;
            params.mapExtent = app.map.extent;
            params.layerIds = [0, 1, 2, 3];
            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "Fires",
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;
        },

        /*
      @param {array} featureObjects - takes an array of feature objects which contain
                                      a feature and some metadata
      @return {array} features - array of features with their info templates set
    */
        setFireTemplates: function(featureObjects) {
            var template,
                features = [];
            arrayUtils.forEach(featureObjects, function(item) {
                template = new InfoTemplate(item.layerName, MapConfig.fires.infoTemplate.content);
                item.feature.setInfoTemplate(template);
                features.push(item.feature);
            });
            return features;
        },

        identifyWDPA: function(mapPoint) {
            // Idenitfy URL is layer 25 using the oilPermit url
            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.palHelper.url),
                params = new IdentifyParameters();

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = app.map.width;
            params.height = app.map.height;
            params.geometry = mapPoint;
            params.mapExtent = app.map.extent;
            params.layerIds = [MapConfig.palHelper.id];
            params.maxAllowableOffset = Math.floor(app.map.extent.getWidth() / app.map.width);

            identifyTask.execute(params, function(features) {
                features.forEach(function(feature) {
                    feature.feature.layer = 'WDPA';
                });

                if (features.length > 0) {
                    deferred.resolve({
                        layer: "WDPA",
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;
        },

        /*
      @param {array} featureObjects - takes an array of feature objects which contain
                                      a feature and some metadata
      @return {array} features - array of features with their info templates set
    */
        setWDPATemplates: function(featureObjects) {
            var template,
                features = [],
                content;

            arrayUtils.forEach(featureObjects, function(item) {
                content = MapConfig.pal.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        item.value + "' data-type='WDPA' data-id='${objectid}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        item.value + "' data-type='WDPA' data-id='${objectid}'>" +
                        "Subscribe</button>" +
                        "</div>";

                template = new InfoTemplate(item.value, content);
                item.feature.setInfoTemplate(template);
                features.push(item.feature);
            });
            return features;
        },

        setOverlaysTemplates: function(featureObjects) {
            var template,
                features = [],
                // dataLayer,
                content;

            arrayUtils.forEach(featureObjects, function(item) {
              // if (item.layerId === 6 || item.layerId === 7) {
              //   dataLayer = 5;
              // }
                content = MapConfig.overlays.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-layer=" +
                        item.layerId + " data-label='" +
                        item.value + "' data-type='overlays' data-id='${OBJECTID}'>" +
                        'Analyze</button>' +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-layer=" +
                        item.layerId + " data-label='" +
                        item.value + "' data-type='overlays' data-id='${OBJECTID}'>" +
                        'Subscribe</button>' +
                        '</div>';

                template = new InfoTemplate(item.value, content);
                item.feature.setInfoTemplate(template);
                features.push(item.feature);
            });
            return features;
        },

        identifyforestUseCommodities: function(mapPoint) {
            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.rspoPerm.url),
                params = new IdentifyParameters();

            if (app.map.getLayer(MapConfig.rspoPerm.id).visibleLayers.indexOf(0) === -1) {
              return false; //Layer 0 (RSPO) is the only layer in the service we'll allow an ID task on
            }

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = app.map.width;
            params.height = app.map.height;
            params.geometry = mapPoint;
            params.mapExtent = app.map.extent;
            params.layerIds = [0]; //app.map.getLayer(MapConfig.rspoPerm.id).visibleLayers;

            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
            params.maxAllowableOffset = Math.floor(app.map.extent.getWidth() / app.map.width);

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    features.forEach(function(feature) {
                        feature.feature.layer = 'forestUseCommodities'; //"forestUseCommodities-" + feature.layerId;
                    });

                    deferred.resolve({
                        layer: 'forestUseCommodities',
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;
        },

        identifyforestUseLandUse: function(mapPoint) {
            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.oilPerm.url),
                params = new IdentifyParameters();

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = app.map.width;
            params.height = app.map.height;
            params.geometry = mapPoint;
            params.mapExtent = app.map.extent;
            params.layerIds = app.map.getLayer(MapConfig.oilPerm.id).visibleLayers;
            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
            params.maxAllowableOffset = Math.floor(app.map.extent.getWidth() / app.map.width);

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    features.forEach(function(feature) {
                        feature.feature.layer = "forestUseLandUse-" + feature.layerId;
                    });

                    deferred.resolve({
                        layer: "forestUseLandUse",
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;
        },

        identifyOverlaysLayer: function(mapPoint) {

            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.overlays.url),
                params = new IdentifyParameters();

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = app.map.width;
            params.height = app.map.height;
            params.geometry = mapPoint;
            params.mapExtent = app.map.extent;
            // params.layerIds = app.map.getLayer(MapConfig.overlays.id).visibleLayers;
            params.layerIds = [5];
            params.maxAllowableOffset = Math.floor(app.map.extent.getWidth() / app.map.width);

            identifyTask.execute(params, function(features) {
                features.forEach(function(feature) {
                    feature.feature.layer = 'overlays';
                });

                if (features.length > 0) {
                    deferred.resolve({
                        layer: 'overlays',
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;
        },

        identifyBiomesLayer: function (mapPoint) {
          var deferred = new Deferred(),
              identifyTask = new IdentifyTask(MapConfig.biomes.url),
              params = new IdentifyParameters();

          params.tolerance = 3;
          params.returnGeometry = true;
          params.width = app.map.width;
          params.height = app.map.height;
          params.geometry = mapPoint;
          params.mapExtent = app.map.extent;
          params.layerIds = [MapConfig.biomes.layerId];
          params.maxAllowableOffset = Math.floor(app.map.extent.getWidth() / app.map.width);

          identifyTask.execute(params, function (results) {
            if (results.length > 0) {
              results.forEach(function (featureObj) {
                featureObj.feature.layer = "Biomes";
              });

              deferred.resolve({
                layer: "Biomes",
                features: results
              });

            } else {
              deferred.resolve(false);
            }
          });

          return deferred;
        },

        setBiomesTemplates: function (featureObjects) {
          var features = [],
              content;

          featureObjects.forEach(function (item) {
            content = MapConfig.biomes.infoTemplate.content;
            item.feature.setInfoTemplate(new InfoTemplate(item.value, content));
            features.push(item.feature);
          });

          return features;
        },

        identifyPlantationsTypeLayer: function (mapPoint) {
          var deferred = new Deferred(),
              identifyTask = new IdentifyTask(MapConfig.byType.url),
              params = new IdentifyParameters();

          params.tolerance = 3;
          params.returnGeometry = true;
          params.width = app.map.width;
          params.height = app.map.height;
          params.geometry = mapPoint;
          params.mapExtent = app.map.extent;
          params.layerIds = [MapConfig.byType.layerId];
          params.maxAllowableOffset = Math.floor(app.map.extent.getWidth() / app.map.width);

          identifyTask.execute(params, function (results) {
            if (results.length > 0) {
              results.forEach(function (featureObj) {
                featureObj.feature.layer = "byType";
              });

              deferred.resolve({
                layer: "byType",
                features: results
              });

            } else {
              deferred.resolve(false);
            }
          });

          return deferred;
        },

        identifyPlantationsSpeciesLayer: function (mapPoint) {
          var deferred = new Deferred(),
              identifyTask = new IdentifyTask(MapConfig.bySpecies.url),
              params = new IdentifyParameters();

          params.tolerance = 3;
          params.returnGeometry = true;
          params.width = app.map.width;
          params.height = app.map.height;
          params.geometry = mapPoint;
          params.mapExtent = app.map.extent;
          params.layerIds = [MapConfig.bySpecies.layerId];
          console.log(params)
          params.maxAllowableOffset = Math.floor(app.map.extent.getWidth() / app.map.width);

          identifyTask.execute(params, function (results) {
            if (results.length > 0) {
              results.forEach(function (featureObj) {
                featureObj.feature.layer = "bySpecies";
              });

              deferred.resolve({
                layer: "bySpecies",
                features: results
              });

            } else {
              deferred.resolve(false);
            }
          });

          return deferred;
        },

        setPlantationsTypeTemplates: function (featureObjects) {
          var features = [],
              content;

          featureObjects.forEach(function (item) {
            content = MapConfig.bySpecies.infoTemplate.content;
            item.feature.setInfoTemplate(new InfoTemplate('Plantations by Type', content +
           "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
           item.value + "' data-type='Plantations by Type' data-id='${objectid}'>" +
           "Analyze</button>" +
           "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
           item.value + "' data-type='Plantations by Type' data-id='${objectid}'>" +
           "Subscribe</button>" +
           "</div>"));
            features.push(item.feature);
          });

          return features;
        },

        setPlantationsSpeciesTemplates: function (featureObjects) {
          var features = [],
              content;

          featureObjects.forEach(function (item) {
            content = MapConfig.bySpecies.infoTemplate.content;
            item.feature.setInfoTemplate(new InfoTemplate('Plantations by Species', content +
           "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
           item.value + "' data-type='Plantations by Species' data-id='${objectid}'>" +
           "Analyze</button>" +
           "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
           item.value + "' data-type='Plantations by Species' data-id='${objectid}'>" +
           "Subscribe</button>" +
           "</div>"));
            features.push(item.feature);
          });

          return features;
        },

        /*
      @param {array} featureObjects - takes an array of feature objects which contain
                                      a feature and some metadata
      @return {array} features - array of features with their info templates set
    */
        // setConcessionTemplates: function(featureObjects) {
        //     var template,
        //         features = [],
        //         self = this;

        //     arrayUtils.forEach(featureObjects, function(item) {
        //         if (item.layerId === 27) {
        //             template = new InfoTemplate(item.value,
        //                 MapConfig.rspoPerm.infoTemplate.content +
        //                 "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
        //                 item.value + "' data-type='RSPO Oil palm concession' data-id='${OBJECTID}'>" +
        //                 "Analyze</button>" +
        //                 "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
        //                 item.value + "' data-type='RSPO Oil palm concession' data-id='${OBJECTID}'>" +
        //                 "Subscribe</button>" +
        //                 "</div>"
        //             );
        //             item.feature.setInfoTemplate(template);
        //             features.push(item.feature);
        //         } else if (item.layerId === 16) {
        //             console.log("Finder >>> setConcessionTemplates");
        //         } else {
        //             template = new InfoTemplate(item.value,
        //                 MapConfig.oilPerm.infoTemplate.content +
        //                 "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
        //                 item.value + "' data-type='${TYPE}' data-id='${OBJECTID}'>" +
        //                 "Analyze</button>" +
        //                 "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
        //                 item.value + "' data-type='${TYPE}' data-id='${OBJECTID}'>" +
        //                 "Subscribe</button>" +
        //                 "</div>"
        //             );
        //             item.feature.setInfoTemplate(template);
        //             features.push(item.feature);
        //         }
        //     });
        //     return features;
        // },

        setForestUseCommoditiesTemplates: function(featureObjects) {
            var template,
                features = [],
                self = this;


            arrayUtils.forEach(featureObjects, function(item) {
                console.log(item.layerId)
                if (item.layerId === 4) {
                    template = new InfoTemplate(item.value,
                        MapConfig.rspoPerm.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        item.value + "' data-type='RSPO Oil palm concession' data-id='${OBJECTID}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        item.value + "' data-type='RSPO Oil palm concession' data-id='${OBJECTID}'>" +
                        "Subscribe</button>" +
                        "</div>"
                    );
                    item.feature.setInfoTemplate(template);
                    features.push(item.feature);
                } else if (item.layerId === 6) {
                    // debugger
                    template = new InfoTemplate(item.value,
                        MapConfig.mill.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        "${mill_name}' data-type='MillPoint' data-id='${wri_id}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        "${mill_name}' data-type='MillPoint' data-id='${wri_id}'>Subscribe</button>" +
                        "</div>"
                    );
                    item.feature.setInfoTemplate(template);
                    features.push(item.feature);
                } else if (item.layerId === 27) {
                    template = new InfoTemplate(item.value,
                        MapConfig.gfwMill.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        "${mill_name_}' data-type='MillPoint' data-id='${wri_id}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        "${mill_name_}' data-type='MillPoint' data-id='${wri_id}'>Subscribe</button>" +
                        "</div>"
                    );
                    item.feature.setInfoTemplate(template);
                    // prevent duplicate features
                    if (features.filter(function(f) {return f.attributes.wri_id === item.feature.attributes.wri_id}).length === 0) {
                      features.push(item.feature);
                    }
                }
            });
            return features;
        },

        setForestUseLandUseTemplates: function(featureObjects) {
            var template,
                features = [],
                self = this;

            arrayUtils.forEach(featureObjects, function(item) {
                console.log(item.layerId) // 0,1,2,3
                if (item.layerId === 0) {
                    template = new InfoTemplate(item.value,
                        MapConfig.oilPerm.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        item.value + "' data-type='Wood fiber plantation' data-id='${OBJECTID}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        item.value + "' data-type='Wood fiber plantation' data-id='${OBJECTID}'>" +
                        "Subscribe</button>" +
                        "</div>"
                    );
                    item.feature.setInfoTemplate(template);
                    features.push(item.feature);
                } else if (item.layerId === 1) {
                    // debugger
                    template = new InfoTemplate(item.value,
                        MapConfig.oilPerm.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        item.value + "' data-type='Oil palm concession' data-id='${OBJECTID}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        item.value + "' data-type='Oil palm concession' data-id='${OBJECTID}'>" +
                        "Subscribe</button>" +
                        "</div>"
                    );
                    item.feature.setInfoTemplate(template);
                    features.push(item.feature);
                } else if (item.layerId === 2) {

                    template = new InfoTemplate(item.feature.attributes.Company,//item.value,
                        MapConfig.oilPerm.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        item.value + "' data-type='Mining concession' data-id='${OBJECTID}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        item.value + "' data-type='Mining concession' data-id='${OBJECTID}'>" +
                        "Subscribe</button>" +
                        "</div>"
                    );
                    item.feature.setInfoTemplate(template);
                    features.push(item.feature);
                } else if (item.layerId === 3) {
                    template = new InfoTemplate(item.value,
                        MapConfig.oilPerm.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        item.value + "' data-type='Logging concession' data-id='${OBJECTID}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        item.value + "' data-type='Logging concession' data-id='${OBJECTID}'>" +
                        "Subscribe</button>" +
                        "</div>"
                    );
                    item.feature.setInfoTemplate(template);
                    features.push(item.feature);
                }
            });
            return features;
        },


        identifyWizardDynamicLayer: function(mapPoint) {
            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.adminUnitsLayer.url),
                layer = app.map.getLayer(MapConfig.adminUnitsLayer.id),
                params = new IdentifyParameters(),
                layerDefs = [];

            // Layer Defs All Possible Layers
            layerDefs[7] = "1 = 1";
            layerDefs[13] = layer.layerDefinitions[13];

            params.tolerance = 3;
            params.returnGeometry = false;
            params.width = app.map.width;
            params.height = app.map.height;
            params.geometry = mapPoint;
            params.mapExtent = app.map.extent;
            params.layerIds = layer.visibleLayers;
            params.layerDefinitions = layerDefs;
            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                if (features.length > 0) {
                    deferred.resolve({
                        layer: "WizardDynamic",
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;
        },

        /*
      @param {array} featureObjects - takes an array of feature objects which contain
                                      a feature and some metadata
      @return {array} features - array of features with their info templates set
    */
        setWizardTemplates: function(featureObjects) {
            var template,
                features = [],
                self = this;

            arrayUtils.forEach(featureObjects, function(item) {
                if (item.layerId === 7) {
                    template = new InfoTemplate(item.value,
                        MapConfig.adminUnitsLayer.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        "${NAME_2}' data-type='AdminBoundary' data-id='${OBJECTID}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        "${NAME_2}' data-type='AdminBoundary' data-id='${OBJECTID}'>" +
                        "Subscribe</button>" +
                        "</div>"
                    );
                } else {
                    template = new InfoTemplate(item.value,
                        MapConfig.certificationSchemeLayer.infoTemplate.content +
                        "<div><button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                        item.value + "' data-type='CertScheme' data-id='${OBJECTID}'>" +
                        "Analyze</button>" +
                        "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                        item.value + "' data-type='CertScheme' data-id='${OBJECTID}'>" +
                        "Subscribe</button>" +
                        "</div>"
                    );
                }
                item.feature.setInfoTemplate(template);
                features.push(item.feature);
            });
            return features;
        },

        identifyMillPoints: function(mapPoint) {
            var deferred = new Deferred(),
                identifyTask = new IdentifyTask(MapConfig.mill.url),
                layer = app.map.getLayer(MapConfig.mill.id),
                params = new IdentifyParameters(),
                layerDefs = [];

            layerDefs[0] = "1 = 1";

            params.tolerance = 3;
            params.returnGeometry = true;
            params.width = app.map.width;
            params.height = app.map.height;
            params.geometry = mapPoint;
            params.mapExtent = app.map.extent;
            params.layerIds = layer.visibleLayers;
            params.layerDefinitions = layerDefs;
            params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

            identifyTask.execute(params, function(features) {
                features.forEach(function(feature) {
                    feature.feature.layer = 'MillPoints';
                });

                if (features.length > 0) {
                    deferred.resolve({
                        layer: "MillPoints",
                        features: features
                    });
                } else {
                    deferred.resolve(false);
                }
            }, function(error) {
                deferred.resolve(false);
            });

            return deferred.promise;
        },



        getCustomGraphics: function(evt) {
            var deferred = new Deferred();

            if (evt.graphic && evt.graphic._layer.id === MapConfig.customGraphicsLayer.id) {
                deferred.resolve({
                    layer: 'CustomGraphics',
                    feature: evt.graphic
                });
            } else {
                deferred.resolve(false);
            }

            return deferred.promise;
        },

        /*
      @param {object} feature - take a arcgis graphic object
      @return {object} feature - returns a feature with an infoTemplate applied
    */
        setCustomGraphicTemplates: function(feature) {
            var label = feature.attributes.WRI_label,
                infoTemplate;

            infoTemplate = new InfoTemplate(label,
                MapConfig.customGraphicsLayer.infoTemplate.content +
                "<div>" +
                "<button id='popup-analyze-area' class='popupAnalyzeButton' data-label='" +
                label + "' data-type='CustomGraphic' data-id='${WRI_ID}'>" +
                "Analyze</button>" +
                "<button id='subscribe-area' class='popupSubscribeButton float-right' data-label='" +
                label + "' data-type='CustomGraphic' data-id='${WRI_ID}'>" +
                "Subscribe</button>" +
                "</div>"
            );
            feature.setInfoTemplate(infoTemplate);
            return feature;
        },

        // The formatter functions must be in the global scope so attach them to window
        createFormattingFunctions: function() {
            // Formatting functions take a graphic as a parameter or a value,key,data(feature) combo
            // and MUST RETURN a string, reference to HTML element, or a deferred
            window.checkAvailable = function(value, key, data) {
                return (data[key] === undefined || data[key] === "Null") ? "N/A" : data[key];
            };
        },

        setupInfowindowListeners: function() {
            var handle,
                subscribeHandle;

            on(app.map.infoWindow, 'selection-change', function() {
                setTimeout(function() {
                    if (dom.byId('popup-analyze-area')) {
                        if (handle) {
                            handle.remove();
                        }
                        handle = on(dom.byId('popup-analyze-area'), 'click',
                            WizardHelper.analyzeAreaFromPopup.bind(WizardHelper));
                    }
                    if (dom.byId('subscribe-area')) {
                      if (subscribeHandle) {
                        subscribeHandle.remove();
                      }
                      subscribeHandle = on(dom.byId('subscribe-area'), 'click', AlertsHelper.subscribeFromPopup)
                    }
                }, 0);
            });

            on(app.map.infoWindow, 'hide', function() {
                if (handle) {
                    handle.remove();
                }
                if (subscribeHandle) {
                    subscribeHandle.remove();
                }
            });

        }

    };

});
