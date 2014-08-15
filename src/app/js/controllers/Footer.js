define([
	"dojo/dom"
], function (dom) {
	'use strict';

	var initialized = false;

	return {

		init: function (template) {
			
			if (initialized) {
				return;
			}

			initialized = true;
			dom.byId("app-footer").innerHTML = template;

		}

	};

});