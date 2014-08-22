define([
	"dojo/dom-class",
	"utils/Loader",	
	"controllers/Header",
	"controllers/Footer",
	"controllers/MapController",
	"controllers/HomeController",
	"controllers/AboutController",
	"controllers/DataController",
	"controllers/MethodsController",
	"controllers/PublicationsController"
], function (domClass, Loader, Header, Footer, MapController, HomeController, AboutController, DataController, MethodsController, PublicationsController) {
	'use strict';

	return {

		init: function (defaultView) {
			var self = this;
			// Initialize Header, Footer, and defaultView
			self.load('footer', Footer.init);
			self.load('header', function (template) {
				Header.init(template);
				// second parameter signifies the view is not external, always false in this case
				Header.updateView(defaultView, false);
				self.load(defaultView);
			});
		},

		load: function (view, callback) {
			var self = this;

			if (!callback) {
				callback = this.getCallback(view);
			}
			Loader.getTemplate(view).then(function (template) {
				callback(template);
				self.viewLoaded(view);
			});

		},

		viewLoaded: function (view) {
			// These views only need to be loaded, nothing else
			if (view === 'header' || view === 'footer') {
				return;
			}

			// If we are in map view, hide footer, else show it
			Footer.toggle(view === 'map');

			// Set header to appropriate style base on view
			Header.toggleForView(view);

			// Set class on app-body
			domClass.remove("app-body");
			domClass.add("app-body", view + "View");

		},

		getCallback: function (view) {
			switch (view) {
				case 'home':
					return HomeController.init.bind(HomeController);
				case 'map':
					return MapController.init.bind(MapController);
				case 'data':
					return DataController.init.bind(DataController);
				case 'methods':
					return MethodsController.init.bind(MethodsController);
				case 'about':
					return AboutController.init.bind(AboutController);
				case 'publications':
					return PublicationsController.init.bind(PublicationsController);
				default:
				 return;
			}
		}

	};

});