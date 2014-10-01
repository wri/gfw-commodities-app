define([
  "dojo/on",
	"dojo/dom",
  "dojo/Deferred",
  "dojo/promise/all",
  "map/config",
	"map/MapModel",
  "analysis/WizardHelper",
	"esri/graphic",
	"dojo/_base/array",
  "esri/InfoTemplate",
	"esri/geometry/Point",
  "esri/tasks/IdentifyTask",
  "esri/tasks/IdentifyParameters",
	"esri/geometry/webMercatorUtils",
	"esri/symbols/PictureMarkerSymbol"  
], function (on, dom, Deferred, all, MapConfig, MapModel, WizardHelper, Graphic, arrayUtils, InfoTemplate, Point, IdentifyTask, IdentifyParameters, webMercatorUtils, PictureSymbol) {
	'use strict';

  // NOTE: Map is available as app.map

	return {

		searchAreaByCoordinates: function () {
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
                  invalidValue = isNaN(parseInt(value));
              }
              return isNaN(parseInt(value)) ? 0 : parseInt(value);
          },
          nextAvailableId = function() {
              var value = 0;
              arrayUtils.forEach(app.map.graphics.graphics, function(g) {
                  if (g.attributes) {
                      if (g.attributes.locatorValue) {
                          value = Math.max(value, parseInt(g.attributes.locatorValue));
                      }
                  }
              });
              return value;
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
          point = webMercatorUtils.geographicToWebMercator(new Point(longitude, latitude));
          attributes.locatorValue = nextAvailableId();
          attributes.id = 'LOCATOR_' + attributes.locatorValue;
          graphic = new Graphic(point, symbol, attributes);
          app.map.graphics.add(graphic);
          app.map.centerAndZoom(point, 7);
          MapModel.set('showClearPinsOption', true);
      }
		},

    performIdentify: function (evt) {
      // If none of the layers we identify on are visible, then return immediately after checks
      var mapPoint = evt.mapPoint,
          deferreds = [],
          features = [],
          self = this;

      // Clear out Previous Features
      app.map.infoWindow.clearFeatures();

      if (app.map.getLayer(MapConfig.fires.id).visible) {
        deferreds.push(self.identifyFires(mapPoint));
      }

      if (app.map.getLayer(MapConfig.pal.id).visible) {
        deferreds.push(self.identifyWDPA(mapPoint));
      }

      if (app.map.getLayer(MapConfig.oilPerm.id).visible) {
        deferreds.push(self.identifyConcessions(mapPoint));
      }

      if (app.map.getLayer(MapConfig.adminUnitsLayer.id).visible) {
        deferreds.push(self.identifyWizardDynamicLayer(mapPoint));
      }

      if (app.map.getLayer(MapConfig.customGraphicsLayer.id).visible) {
        deferreds.push(self.getCustomGraphics(evt));
      }

      if (deferreds.length === 0) {
        return;
      }

      /*
        featureObject has the following structure properties
        layer - the layer the feature belongs to, current possible values are:
              - Fires, WDPA, Concessions
        features - array of features found by the identify task
      */

      all(deferreds).then(function (featureSets) {
        arrayUtils.forEach(featureSets, function (item) {
          switch (item.layer) {
            case "Fires":
              features = features.concat(self.setFireTemplates(item.features));
            break;
            case "WDPA":
              features = features.concat(self.setWDPATemplates(item.features));
            break;
            case "Concessions":
              features = features.concat(self.setConcessionTemplates(item.features));
            break;
            case "WizardDynamic":
              features = features.concat(self.setWizardTemplates(item.features));
            break;
            case "CustomGraphics":
              // This will only contain a single feature and return a single feature
              // instead of an array of features
              features.push(self.setCustomGraphicTemplates(item.feature));
            break;
            default: // Do Nothing
            break;
          }
        });

        app.map.infoWindow.setFeatures(features);
        app.map.infoWindow.show(mapPoint);

      });


    },

    identifyFires: function (mapPoint) {
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
      
      identifyTask.execute(params, function (features) {
        if (features.length > 0) {
          deferred.resolve({
            layer: "Fires",
            features: features
          });
        } else {
          deferred.resolve(false);
        }
      }, function (error) {
        deferred.resolve(false);
      });

      return deferred.promise;
    },

    /*
      @param {array} featureObjects - takes an array of feature objects which contain
                                      a feature and some metadata
      @return {array} features - array of features with their info templates set
    */
    setFireTemplates: function (featureObjects) {
      var template,
          features = [];
      arrayUtils.forEach(featureObjects, function (item) {
        template = new InfoTemplate(item.layerName, MapConfig.fires.infoTemplate.content);
        item.feature.setInfoTemplate(template);
        features.push(item.feature);
      });
      return features;
    },

    identifyWDPA: function (mapPoint) {
      // Idenitfy URL is layer 25 using the oilPermit url
      var deferred = new Deferred(),
          identifyTask = new IdentifyTask(MapConfig.oilPerm.url),
          params = new IdentifyParameters();

      params.tolerance = 3;
      params.returnGeometry = true;
      params.width = app.map.width;
      params.height = app.map.height;
      params.geometry = mapPoint;
      params.mapExtent = app.map.extent;
      params.layerIds = [25];      
      
      identifyTask.execute(params, function (features) {
        if (features.length > 0) {
          deferred.resolve({
            layer: "WDPA",
            features: features
          });
        } else {
          deferred.resolve(false);
        }
      }, function (error) {
        deferred.resolve(false);
      });

      return deferred.promise;
    },

    /*
      @param {array} featureObjects - takes an array of feature objects which contain
                                      a feature and some metadata
      @return {array} features - array of features with their info templates set
    */
    setWDPATemplates: function (featureObjects) {
      var template,
          features = [];
      arrayUtils.forEach(featureObjects, function (item) {
        template = new InfoTemplate(item.value, MapConfig.pal.infoTemplate.content);
        item.feature.setInfoTemplate(template);
        features.push(item.feature);
      });
      return features;
    },

    identifyConcessions: function (mapPoint) {
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
      
      identifyTask.execute(params, function (features) {
        if (features.length > 0) {
          deferred.resolve({
            layer: "Concessions",
            features: features
          });
        } else {
          deferred.resolve(false);
        }
      }, function (error) {
        deferred.resolve(false);
      });

      return deferred.promise;
    },

    /*
      @param {array} featureObjects - takes an array of feature objects which contain
                                      a feature and some metadata
      @return {array} features - array of features with their info templates set
    */
    setConcessionTemplates: function (featureObjects) {
      var template,
          features = [],
          self = this;

      arrayUtils.forEach(featureObjects, function (item) {
        template = new InfoTemplate(item.value, 
          MapConfig.oilPerm.infoTemplate.content +
          "<div><button id='popup-analyze-area' data-label='" + 
          item.value + "' data-type='${TYPE}' data-id='${OBJECTID}'>" +
          "Analyze this area</button></div>"
        );
        item.feature.setInfoTemplate(template);
        features.push(item.feature);
      });
      return features;
    },

    identifyWizardDynamicLayer: function (mapPoint) {
      var deferred = new Deferred(),
          identifyTask = new IdentifyTask(MapConfig.adminUnitsLayer.url),
          params = new IdentifyParameters(),
          type = MapModel.get('wizardsSchemeEntityValue'),
          layerDefs = [];

      // Layer Defs All Possible Layers
      layerDefs[7] = "1 = 1";
      layerDefs[13] = "TYPE = '" + type + "'";

      params.tolerance = 3;
      params.returnGeometry = true;
      params.width = app.map.width;
      params.height = app.map.height;
      params.geometry = mapPoint;
      params.mapExtent = app.map.extent;
      params.layerIds = app.map.getLayer(MapConfig.adminUnitsLayer.id).visibleLayers;
      params.layerDefinitions = layerDefs;
      params.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
      
      identifyTask.execute(params, function (features) {
        if (features.length > 0) {
          deferred.resolve({
            layer: "WizardDynamic",
            features: features
          });
        } else {
          deferred.resolve(false);
        }
      }, function (error) {
        deferred.resolve(false);
      });

      return deferred.promise;
    },

    /*
      @param {array} featureObjects - takes an array of feature objects which contain
                                      a feature and some metadata
      @return {array} features - array of features with their info templates set
    */
    setWizardTemplates: function (featureObjects) {
      var template,
          features = [],
          self = this;

      arrayUtils.forEach(featureObjects, function (item) {
        if (item.layerId === 7) {
          template = new InfoTemplate(item.value, 
            MapConfig.adminUnitsLayer.infoTemplate.content +
            "<div><button id='popup-analyze-area' data-label='" + 
            "${NAME_1}' data-type='AdminBoundary' data-id='${OBJECTID}'>" +
            "Analyze this area</button></div>"
          );
        } else {
          template = new InfoTemplate(item.value, 
            MapConfig.certificationSchemeLayer.infoTemplate.content +
            "<div><button id='popup-analyze-area' data-label='" + 
            item.value + "' data-type='CertScheme' data-id='${OBJECTID}'>" +
            "Analyze this area</button></div>"
          );
        }
        item.feature.setInfoTemplate(template);
        features.push(item.feature);
      });
      return features;
    },

    getCustomGraphics: function (evt) {
      var deferred = new Deferred();

      if (evt.graphic) {
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
    setCustomGraphicTemplates: function (feature) {
      var label = feature.attributes.WRI_label,
          infoTemplate;

      infoTemplate = new InfoTemplate(label,
        MapConfig.customGraphicsLayer.infoTemplate.content +
        "<div><button id='popup-analyze-area' data-label='" + 
            label + "' data-type='CustomGraphic' data-id='${WRI_ID}'>" +
            "Analyze this area</button></div>"
      );
      feature.setInfoTemplate(infoTemplate);
      return feature;
    },

    // The formatter functions must be in the global scope so attach them to window
    createFormattingFunctions: function () {
      // Formatting functions take a graphic as a parameter or a value,key,data(feature) combo
      // and MUST RETURN a string, reference to HTML element, or a deferred
      window.checkAvailable = function (value, key, data) {
        return (data[key] === undefined || data[key] === "Null") ? "N/A" : data[key];
      };
    },

    setupInfowindowListeners: function () {
      var handle;

      on(app.map.infoWindow, 'selection-change', function () {        
        setTimeout(function () {
          if (dom.byId('popup-analyze-area')) {
            if (handle) { handle.remove(); }
            handle = on(dom.byId('popup-analyze-area'), 'click', 
              WizardHelper.analyzeAreaFromPopup.bind(WizardHelper));
          }
        }, 0);
      });

      on(app.map.infoWindow, 'hide', function () {
        if (handle) {
          handle.remove();
        }
      });

    }

	};

});