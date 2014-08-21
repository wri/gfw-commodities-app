define([
	"dojo/topic",
	"map/config",
	"controllers/MapController",
	"controllers/ViewController",
	"controllers/LayerController"
], function (topic, MapConfig, MapController, ViewController, LayerController) {
	'use strict';

	return {

		startListening: function () {

			// View Controller Events
			topic.subscribe('changeView', function (newView) {
				ViewController.load(newView);
			});
			// Layer Controller Functions
			topic.subscribe('toggleLayer', function (layerId) {
				var config = MapConfig[layerId];
				if (config) {
					LayerController.toggleLayers(config);
				}
			});

			// Layer Controller Functions
			topic.subscribe('showLayer', function (layerId) {
				var config = MapConfig[layerId];
				if (config) {
					LayerController.showLayer(config);
				}
			});

			topic.subscribe('hideLayer', function (layerId) {
				var config = MapConfig[layerId];
				if (config) {
					LayerController.hideLayer(config);
				}
			});

			topic.subscribe('updateLayer', function (props) {
				LayerController.updateLayer(props);
			});

		}

	};

});