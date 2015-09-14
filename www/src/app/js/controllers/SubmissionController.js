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
				registry.byId("stackContainer").selectChild("submissionView");
				return;
			}

			initialized = true;
			registry.byId("stackContainer").selectChild("submissionView");
			registry.byId("submissionView").set('content', template);

            var context = "submission";
            NavListController.loadNavControl(context);
            NavListController.loadNavView(context);

		}

	};

});