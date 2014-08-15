define([
	"dojo/topic",
	"controllers/ViewController"
], function (topic, ViewController) {
	'use strict';

	return {

		startListening: function () {

			topic.subscribe("changeView", function (newView) {
				ViewController.load(newView);
			});

		}

	};

});