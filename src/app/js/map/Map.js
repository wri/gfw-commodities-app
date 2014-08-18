define([
	"dojo/Evented",
	"dojo/_base/declare",
	"dojo/on",
	"esri/map",
	"map/config",
	"dojo/dom-construct",
	"esri/dijit/HomeButton"
], function (Evented, declare, on, Map, MapConfig, domConstruct, HomeButton) {
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
			this.addWidgets();
			this.bindEvents();
			this.emit('map-ready', {});
		},

		addWidgets: function () {

			var home;

			domConstruct.create("div", {
        'id': 'home-button',
        'class': 'home-button'
      }, document.querySelector(".esriSimpleSliderIncrementButton"), "after");

      home = new HomeButton({
          map: this.map
      }, "home-button");
      home.startup();
		},

		bindEvents: function () {

		}

	});

	return _map;

});