define([
	"dojo/topic",
	"controllers/MapController",
	"controllers/ViewController"
], function (topic, MapController, ViewController) {
	'use strict';

	return {

		startListening: function () {

			// View Controller Events
			topic.subscribe('changeView', function (newView) {
				ViewController.load(newView);
			});

			// Map Controller Tools
			topic.subscribe('toggleLayer', function (layerId) {
				//alert(layerId);
			});

		}

	};

});