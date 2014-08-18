define([
	"dojo/dom",
	"dijit/registry",
	"map/config",
	"map/Map"
], function (dom, registry, MapConfig, Map) {
	'use strict';

	var initialized = false,
			map;

	return {

		init: function (template) {
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("mapView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("mapView");
			registry.byId("mapView").set('content', template);
			// This is not esri map, it is custom map class, esri map object available as map.map
			var map = new Map(MapConfig.mapOptions);

		}

	};

});