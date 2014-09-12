define([

], function () {
	'use strict';

	return {

		init: function () {
			// Payload is passed as Global Payload object, grab and make sure its defined before doing anything else
			if (window.payload) {
				console.dir(window.payload);
			}
		}		

	};

});