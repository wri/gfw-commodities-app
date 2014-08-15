define([
	"dojo/on",
	"dojo/dom",
	"dojo/query",
	"dojo/dom-class",
	"utils/Hasher"
], function (on, dom, query, domClass, Hasher) {
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
			// Helper Functions
			function changeView(evt) {
				var target = evt.target ? evt.target : evt.srcElement,
						view = target.dataset ? target.dataset.view : target.getAttribute('data-view'),
						external = target.dataset ? target.dataset.external : target.getAttribute('data-external');

				query(".header .nav-link.selected").forEach(function (node) {
					domClass.remove(node, 'selected');
				});

				domClass.add(target, 'selected');
				Hasher.setHash('v', view);
			}			
		
			query(".header .nav-link").forEach(function (item) {
				on(item, "click", changeView);
			});

		},

		updateView: function (view) {
			var dataView;

			query(".header .nav-link.selected").forEach(function (node) {
				domClass.remove(node, 'selected');
			});

			query(".header .nav-link").forEach(function (node) {
				dataView = node.dataset ? node.dataset.view : node.getAttribute('data-view');
				if (dataView === view) {
					domClass.add(node, "selected");
				}
			});
		}

	};

});