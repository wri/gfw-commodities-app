define([
    "dojo/dom",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-style",
    "dijit/registry",
    "controllers/NavListController"
], function (dom, query, domClass, domStyle, registry, NavListController) {
    'use strict';

	var initialized = false;

	return {

		init: function (template) {
			
			if (initialized) {
				registry.byId("stackContainer").selectChild("methodsView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("methodsView");
			registry.byId("methodsView").set('content', template);

            NavListController.loadNavControl("methods");

		}

	};

});