define([
	"dojo/on",
	"dojo/dom",
	"dojo/query",
	"dojo/dom-class",
	"dojo/dom-style",
	"dijit/registry",
	"dojo/dom-geometry",
	"map/config",
	"map/Map",
	"map/Finder",
	"map/MapModel",
	"utils/Animator",
	"components/List"
], function (on, dom, dojoQuery, domClass, domStyle, registry, domGeom, MapConfig, Map, Finder, MapModel, Animator, List) {
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
				// Bind the Model to the Map Panel
				mapModel = MapModel.initialize("map-container");
			});

			// Fade in the map controls, first, get a list of the ids		
			dojoQuery(".gfw .map-layer-controls li").forEach(function (item) {
				ids.push(item.id);
			});
			// FadeIn fades opacity from current opacity to 1
			Animator.fadeIn(ids, {
				duration: 100
			});

			// Render any React Components
			self.renderComponents();

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

		},

		toggleLayerList: function (el) {
			var filter = el.dataset ? el.dataset.filter : el.getAttribtue('data-filter'),
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
			domClass.add("master-layer-list", filter);

			// Update the list, reuse the title from the first anchor tag in the element (el)
			layerList.setProps({
				title: el.children[0].innerHTML,
				filter: filter
			});
		},

		renderComponents: function () {

			var items = [],
					key;

			for (key in MapConfig.masterLayerList) {
				items.push(MapConfig.masterLayerList[key]);
			}

			layerList = new List({
				items: items
			}, "master-layer-list");

		}

	};

});