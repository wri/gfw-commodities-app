define([
	"dojo/topic",
	"map/config",
	"map/Controls",
	"map/MapModel",	
	"analysis/Query",
	"analysis/config",
	"analysis/WizardHelper",
	"map/LayerController",
	"controllers/MapController",
	"controllers/ViewController"
], function (topic, MapConfig, Controls, MapModel, AnalyzerQuery, AnalyzerConfig, WizardHelper, LayerController, MapController, ViewController) {
	'use strict';

	return {

		startListening: function () {

			// View Controller Events
			topic.subscribe('changeView', function (newView) {
				ViewController.load(newView);
			});

			// Events coming from the Wizard
			topic.subscribe('toggleWizard', function () {
				WizardHelper.toggleWizard();
			});

			topic.subscribe('setAdminBoundariesDefinition', function (filter) {
				LayerController.setWizardDynamicLayerDefinition(MapConfig.adminUnitsLayer, filter);
				// If filter is none, dont zoom to none, above will turn layer off when none is selected
				if (filter) {
					AnalyzerQuery.zoomToFeatures(AnalyzerConfig.adminUnit.countryBoundaries, filter);
				}
			});

			topic.subscribe('setCertificationSchemeDefinition', function (scheme) {
				LayerController.setWizardDynamicLayerDefinition(MapConfig.certificationSchemeLayer, scheme);
				// If filter is none, dont zoom to none, above will turn layer off when none is selected
				if (scheme) {
					AnalyzerQuery.zoomToFeatures(AnalyzerConfig.certifiedArea.schemeQuery, scheme);
				}
			});

			topic.subscribe("setCommercialEntityDefinition", function (entityType) {
				LayerController.setWizardDynamicLayerDefinition(MapConfig.commercialEntitiesLayer, entityType);
				// If filter is none, dont zoom to none, above will turn layer off when none is selected
				if (entityType) {
					AnalyzerQuery.zoomToFeatures(AnalyzerConfig.commercialEntity.commodityQuery, entityType);
				}
			});			

			// Layer Controller Functions
			topic.subscribe('toggleLayer', function (layerId) {
				var config = MapConfig[layerId];
				if (config) {
					if (config.toolsNode) {
						// Show the opposite of the visible status, if the layer is visible, it is about to be turned off,
						// if the layer is not visible, it is about to be turned on
						var operation = app.map.getLayer(config.id).visible ? 'hide' : 'show';
						Controls.toggleToolbox(config, operation);
					}
					LayerController.toggleLayers(config);
				}
			});

			topic.subscribe('showLayer', function (layerId) {
				var config = MapConfig[layerId];
				if (config) {
					LayerController.showLayer(config);
					if (config.toolsNode) {
						Controls.toggleToolbox(config, 'show');
					}
				}
			});

			topic.subscribe('hideLayer', function (layerId) {
				var config = MapConfig[layerId];
				if (config) {
					LayerController.hideLayer(config);
					if (config.toolsNode) {
						Controls.toggleToolbox(config, 'hide');
					}
				}
			});

			topic.subscribe('updateLayer', function (props) {
				if (props.layerType === "tiled") {
					var config = MapConfig[props.key];
					if (config) {
						LayerController.toggleLayers(config);
					}
				} else if (props.layerType === "dynamic") {
					LayerController.updateLayer(props);
				}
			});

			topic.subscribe('changeLayerTransparency', function (layerKey, layerType, transparencyValue) {
				var config = MapConfig[layerKey];
				if (config) {
					LayerController.changeLayerTransparency(config, layerType, transparencyValue);
				}
			});

			// Map Controller Functions
      topic.subscribe('showInfoPanel', MapController.showInfoPanel);

		}

	};

});