define([
	"dojo/on",
	"dojo/dom",
	"dijit/registry",
	"map/config",
	"map/Map",
	"map/Finder",
	"map/MapModel"
], function (on, dom, registry, MapConfig, Map, Finder, MapModel) {
	'use strict';

	var initialized = false,
			mapModel,
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
			map = new Map(MapConfig.mapOptions);

			// Initialize Helper Classes or pass reference of map to them
			Finder.setMap(map.map);

			map.on("map-ready", this.bindUIEvents);
			// Bind the Model to the Map Panel
			mapModel = MapModel.initialize("map-container");

		},

		bindUIEvents: function () {

			on(dom.byId("locator-widget-button"), "click", function () {
				MapModel.set('showBasemapGallery', false);
				MapModel.set('showLocatorOptions', !MapModel.get('showLocatorOptions'));
			});

			on(dom.byId("basemap-gallery-button"), "click", function () {
				MapModel.set('showLocatorOptions', false);
				MapModel.set('showBasemapGallery', !MapModel.get('showBasemapGallery'));
			});

			on(dom.byId("dms-search"), "change", function (evt) {
				var checked = evt.target ? evt.target.checked : evt.srcElement.checked;
				if (checked) {
					MapModel.set('showDMSInputs', true);
					MapModel.set('showLatLongInputs', false);
				}
			});

			on(dom.byId("lat-long-search"), "change", function (evt) {
				var checked = evt.target ? evt.target.checked : evt.srcElement.checked;
				if (checked) {
					MapModel.set('showDMSInputs', false);
					MapModel.set('showLatLongInputs', true);
				}
			});

			on(dom.byId("search-option-go-button"), "click", function () {
				Finder.searchAreaByCoordinates();
			});

			on(dom.byId("clear-search-pins"), "click", function () {
				map.map.graphics.clear();
        MapModel.set('showClearPinsOption', false);
			})

		}

	};

});