define([
	"dojo/Evented",
	"dojo/_base/declare",
	"dojo/on",
	"dojo/dom",
	"esri/map",
	"map/config",
	"dojo/dom-construct",
	"esri/dijit/Geocoder",
	"esri/dijit/HomeButton",
	"esri/dijit/LocateButton",
	"esri/dijit/BasemapGallery"
], function (Evented, declare, on, dom, Map, MapConfig, domConstruct, Geocoder, HomeButton, Locator, BasemapGallery) {
	'use strict';

	var _map = declare([Evented], {

		element: 'map',

		constructor: function (options) {
			declare.safeMixin(this, options);
			this.createMap();
		},

		createMap: function () {
			var self = this;

			self.map = new Map(this.element, {
				basemap: this.basemap,
				center: [this.centerX, this.centerY],
				sliderPosition: this.sliderPosition,
				zoom: this.zoom
			});

			self.map.on('load', function () {
				self.map.resize();
				self.mapLoaded();
			});


		},

		mapLoaded: function () {
			// Clear out default Esri Graphic at 0,0, dont know why its even there
      this.map.graphics.clear();

			this.addWidgets();
			this.addLayers();
			this.emit('map-ready', {});
		},

		addWidgets: function () {

			var home,
					locator,
					geoCoder,
					basemapGallery;

			domConstruct.create("div", {
        'id': 'home-button',
        'class': 'home-button'
      }, document.querySelector(".esriSimpleSliderIncrementButton"), "after");

      home = new HomeButton({
          map: this.map
      }, "home-button");
      home.startup();

      basemapGallery = new BasemapGallery({
        map: this.map,
        showArcGISBasemaps: true
      }, "basemap-gallery");
      basemapGallery.startup();

      locator = new Locator({
        map: this.map,
        highlightLocation: false
      }, "location-widget");
      locator.startup();

      geoCoder = new Geocoder({
      	map: this.map,
      	autoComplete: true,
      	arcgisGeocoder: {
      		placeholder: "Enter address or region"
      	}      	
      }, "simple-geocoder");
      geoCoder.startup();

		},

		addLayers: function () {
			
		}

	});

	return _map;

});