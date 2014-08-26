define([
	"dojo/on",
	"dojo/dom",
	"dojo/query",
	"dojo/dom-class",
	"utils/Hasher",
	"main/config"
], function (on, dom, query, domClass, Hasher, AppConfig) {
	'use strict';

	var state = 'large', // large, small, or mobile
			initialized = false;

	return {

		init: function (template) {

			if (initialized) {
				return;
			}

			initialized = true;
			dom.byId("app-header").innerHTML = template;
			this.bindEvents();
		},

		setState: function (newState) {
			domClass.remove('app-header', state);
			domClass.add('app-header', newState);
			state = newState;
		},

		bindEvents: function () {
			var self = this;
		
			query(".header .nav-link").forEach(function (item) {
				on(item, "click", function (evt) {
					var target = evt.target ? evt.target : evt.srcElement,
							dataView = target.dataset ? target.dataset.view : target.getAttribute('data-view'),
							external = target.dataset ? target.dataset.external : target.getAttribute('data-external');

					self.updateView(dataView, external);
				});
			});

		},

		updateView: function (view, isExternal) {

			if (isExternal === "true") {
				this.redirectPage(view);
				return;
			}

			query(".header .nav-link.selected").forEach(function (node) {
				domClass.remove(node, 'selected');
			});

			query('.nav-link-list [data-view="' + view + '"]').forEach(function (node) {
				domClass.add(node, "selected");
			});

			Hasher.setHash('v', view);

		},

		toggleForView: function (view) {
			if (view === 'map') {
				this.setForMap();
			} else if (view === 'home') {
				this.setForHome();
			} else {
				this.setForGenericView();
			}
		},

		setForMap: function () {
			domClass.add("nav-content", "outer");
			domClass.remove("nav-content", "inner");
			domClass.add("app-header", "mapView");
			domClass.remove("app-header", "generalView");
		},

		setForGenericView: function () {
			domClass.add("nav-content", "outer");
			domClass.remove("nav-content", "inner");
			domClass.remove("app-header", "mapView");
			domClass.add("app-header", "generalView");
		},

		setForHome: function () {
			domClass.add("nav-content", "inner");
			domClass.remove("nav-content", "outer");
			domClass.remove("app-header", "mapView");
			domClass.remove("app-header", "generalView");
		},

		redirectPage: function (view) {
			window.open(AppConfig.urls[view], "_blank");
		}

	};

});