define([
	"dojo/dom-class",
	"utils/Loader",	
	"controllers/Header",
	"controllers/Footer",
	"controllers/MapController",
	"controllers/HomeController"
], function (domClass, Loader, Header, Footer, MapController, HomeController) {
	'use strict';

	return {

		init: function (defaultView) {
			// Initialize Header, Footer, and defaultView
			this.load('footer', Footer.init);
			this.load('header', function (template) {
				Header.init(template);
				Header.updateView(defaultView);
			});
			this.load(defaultView);
		},

		load: function (view, callback) {
			if (!callback) {
				callback = this.getCallback(view);
			}
			Loader.getTemplate(view).then(callback);
		},

		getCallback: function (view) {
			switch (view) {
				case 'home':
					return HomeController.init.bind(HomeController);
				case 'map':
					return MapController.init.bind(MapController);
				default:
				 return;
			}
		}

	};

});