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
	"map/Controls",
	"map/LayerController",
	"analysis/WizardHelper",
	"components/LayerList"
], function (on, dom, dojoQuery, topic, domClass, domStyle, registry, arrayUtils, domGeom, MapConfig, Map, Finder, MapModel, Hasher, Animator, MapControl, LayerController, WizardHelper, LayerList) {
	'use strict';

	var initialized = false,
			mapModel,
			layerList,
			map;

	return {

		/* NOTE : Set Default Layers in renderComponents at the bottom of the page, 
							Hash needs to be updated before the LayerList is created */

		init: function (template) {

			var self = this,
					ids = [];
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("mapView");
				return;
			}

			initialized = true;
			registry.byId("mapView").set('content', template);
			registry.byId("stackContainer").selectChild("mapView");

			// This is not esri map, it is custom map class, esri map object available as map.map
			map = new Map(MapConfig.mapOptions);

			// Set the map object to the global app variable for easy use throughout the project
			app.map = map.map;

			map.on("map-ready", function () {
				// Bind the Model to the Map Panel, and then again to the list in the header
				mapModel = MapModel.initialize("map-container");
				// Render any React Components - These will activate any default or hashed layers
				// Only use this after the map has been loaded,
				// Also call other functions in renderComponents that build UI elements 
				self.renderComponents();
				// Connect Events
				self.bindUIEvents();
			});

			map.on("layers-loaded", function () {
				/** CODE MOVED TO map-ready EVENT ABOVE **/
				// Render any React Components - These will activate any default or hashed layers
				// Only use this after the layers have been loaded,
				// Also call other functions in renderComponents that build UI elements 
				// self.renderComponents();

				// Connect Events
				// self.bindUIEvents();
				
			});

			// Fade in the map controls, first, get a list of the ids		
			dojoQuery(".gfw .map-layer-controls li").forEach(function (item) {
				ids.push(item.id);
			});
			// FadeIn fades opacity from current opacity to 1
			Animator.fadeIn(ids, {
				duration: 100
			});

		},

		bindUIEvents: function () {

			var self = this;

			on(app.map, "mouse-move", function(evt) {
        MapModel.set('currentLatitude', evt.mapPoint.getLatitude().toFixed(4));
        MapModel.set('currentLongitude', evt.mapPoint.getLongitude().toFixed(4));
      });

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

			dojoQuery(".fires_toolbox .toolbox-list li").forEach(function (node) {
				on(node, "click", MapControl.toggleFiresLayerOptions);
			});

			on(dom.byId("high-confidence"), "change", MapControl.toggleFiresConfidenceLevel);

			dojoQuery(".gfw .overlays-container .overlays-checkbox").forEach(function (node) {
				on(node, "click", MapControl.toggleOverlays);
			});

			on(dom.byId("legend-title"), "click", function () {
				MapControl.toggleLegendContainer();
			});

			on(dom.byId("wizard-tab"), "click", function () {
				WizardHelper.toggleWizard();
			});

			// dojoQuery(".layer-list-item.forest-change input").forEach(function (node) {
			// 	on(node, "change", LayerController.toggleForestChangeLayers.bind(LayerController));
			// });

			// dojoQuery(".layer-list-item.forest-cover input").forEach(function (node) {
			// 	on(node, "change", LayerController.toggleForestCoverLayers.bind(LayerController));
			// });

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

			// If Reverting to Knockout Way, Header data-class need to be changed to first parameter in below functions

			// Hide other List Elements
			// MapModel.set('forestUse', false);
			// MapModel.set('forestCover', false);
			// MapModel.set('forestChange', false);
			// MapModel.set('conservation', false);
			// MapModel.set('agroSuitability', false);

			// MapModel.set(filter, true);
			// MapModel.set('filterTitle', el.children[0].innerHTML);

			// Update the list, reuse the title from the first anchor tag in the element (el)
			if (layerList) {
				layerList.setProps({
					title: el.children[0].innerHTML,
					filter: filter
				});
			}
		},

		renderComponents: function () {

			// Set Default Layers Here if none are present in the URL
			// Current Default Layers(lyrs) are tcc and loss
			var state = Hasher.getHash();
			// If state.lyrs is undefined, set hash, otherwise, load the layers already there
			if (state.lyrs === undefined) {
				Hasher.toggleLayers('tcc');
				Hasher.toggleLayers('loss');
			}

			layerList = new LayerList({
				items: MapConfig.layersUI
			}, "master-layer-list");

			MapControl.generateTimeSliders();

		}

	};

});