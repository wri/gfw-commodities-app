define([
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/window"
], function (domClass, domGeom, win) {
	'use strict';

	return {

		enableLayout: function () {
			var body = win.body(),
					width = domGeom.position(body).w;

			if (width < 960) {
				domClass.add(body, "mobile");
			}

		}

	};

});