define([
    "dojo/dom",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-style",
    "dijit/registry",
    "utils/NavListController"
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

            var context = "methods";
            NavListController.loadNavControl(context);
            NavListController.loadNavView(context);

		}

	};

});