define([
	"dojo/on",
	"dojo/dom",
	"dojo/query",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-style",
	"dijit/registry",
	"dojo/_base/array",
	"dojo/dom-geometry",
	"map/config",
	"map/Map",
	"map/Finder",
	"map/MapModel",
	"utils/Hasher",
	"utils/Animator",
	"controllers/LayerController",
	"components/LayerList"
], function (on, dom, dojoQuery, topic, domClass, domStyle, registry, arrayUtils, domGeom, MapConfig, Map, Finder, MapModel, Hasher, Animator, LayerController, LayerList) {
	'use strict';

	var initialized = false,
			mapModel,
			layerList,
			map;

	return {

		init: function (template) {

			var self = this,
					ids = [];
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("mapView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("mapView");
			registry.byId("mapView").set('content', template);

			// This is not esri map, it is custom map class, esri map object available as map.map
			map = new Map(MapConfig.mapOptions);

			map.on("map-ready", function () {
				// Initialize Helper Classes or pass reference of map to them
				Finder.setMap(map.map);
				// Bind the Model to the Map Panel, and then again to the list in the header
				mapModel = MapModel.initialize("map-container");
				MapModel.applyTo("master-layer-list");

				// Render any React Components - These will activate any default or hashed layers
				// Only use this after map is ready
				self.renderComponents();
			
			});

			// Fade in the map controls, first, get a list of the ids		
			dojoQuery(".gfw .map-layer-controls li").forEach(function (item) {
				ids.push(item.id);
			});
			// FadeIn fades opacity from current opacity to 1
			Animator.fadeIn(ids, {
				duration: 100
			});

			// Connect Events
			self.bindUIEvents();

		},

		bindUIEvents: function () {

			var self = this;

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
			});

			dojoQuery(".map-layer-controls li").forEach(function (node) {
				on(node, "mouseover", function (evt) {
					self.toggleLayerList(node);
				});
			});

			on(dom.byId("master-layer-list"), "mouseleave", function () {
				domStyle.set("master-layer-list", "opacity", 0.0);
				domStyle.set("master-layer-list", "left", '-1000px');
			});

			dojoQuery(".layer-list-item.forest-change input").forEach(function (node) {
				on(node, "change", LayerController.toggleForestChangeLayers.bind(LayerController));
			});

			dojoQuery(".layer-list-item.forest-cover input").forEach(function (node) {
				on(node, "change", LayerController.toggleForestCoverLayers.bind(LayerController));
			});

		},

		toggleLayerList: function (el) {
			var filter = el.dataset ? el.dataset.filter : el.getAttribtue('data-filter'),
					newclass = el.dataset ? el.dataset.class : el.getAttribtue('data-class'),
					position = domGeom.position(el, true),
					containerWidth = 180,
					offset;

			// 200 is the default width of the container, to keep it centered, update containerWidth
			offset = (position.w - containerWidth) / 2;
			domStyle.set("master-layer-list", "left", (position.x + offset) + "px");

			// Show the Container
			Animator.fadeIn("master-layer-list", {
				duration: 100
			});
			// Add the Appropriate Class so the Items display correct color, styling etc.
			domClass.remove("master-layer-list");
			domClass.add("master-layer-list", newclass);

			// Hide other List Elements
			MapModel.set('forestUse', false);
			MapModel.set('forestCover', false);
			MapModel.set('forestChange', false);
			MapModel.set('conservation', false);
			MapModel.set('agroSuitability', false);

			MapModel.set(filter, true);
			MapModel.set('filterTitle', el.children[0].innerHTML);

			// Update the list, reuse the title from the first anchor tag in the element (el)
			// layerList.setProps({
			// 	title: el.children[0].innerHTML,
			// 	filter: filter
			// });
		},

		renderComponents: function () {

			// var items = [],
			// 		key;

			// for (key in MapConfig.masterLayerList) {
			// 	items.push(MapConfig.masterLayerList[key]);
			// }

			// // Push in Null Entry to Disable Group of Layers
			// arrayUtils.forEach(MapConfig.masterListRadioButtons, function (radio) {
			// 	items.push(radio);
			// });

			// layerList = new LayerList({
			// 	items: items
			// }, "master-layer-list");

		}

	};

});