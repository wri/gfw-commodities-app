define([
	"dojo/hash",
	"dojo/io-query",
	"dojo/topic"
], function (hash, ioQuery, topic) {
	'use strict';

	var currentView;

	return {
		// Grab initial hash or set initial hash to home and return current view
		init: function () {
			var state = ioQuery.queryToObject(hash()),
					defaultView = 'home',
					self = this;

			if (state.hasOwnProperty('v')) {
				defaultView = state.v;
			} else {
				state.v = 'home';
				hash(ioQuery.objectToQuery(state));
			}			

			currentView = state.v;
			topic.subscribe("/dojo/hashchange", function (changedHash) {
				state = ioQuery.queryToObject(changedHash);
				// If view has not changed, do nothing
				if (state.v === currentView) {
					return;
				}
				currentView = state.v;
				self.changeView(currentView);
			});
			return defaultView;
		},

		getHash: function (key) {
			return ioQuery.queryToObject(hash())[key];
		},

		setHash: function (key, value) {
			var state = ioQuery.queryToObject(hash());
			state[key] = value;
			hash(ioQuery.objectToQuery(state));
		},

		toggleLayers: function (layerId) {
			var state = ioQuery.queryToObject(hash()),
					lyrsArray,
					index;

			lyrsArray = state.lyrs ? state.lyrs.split(",") : [];
			index = lyrsArray.indexOf(layerId);

			if (index > -1) {
				lyrsArray.splice(index, 1);
			} else {
				lyrsArray.push(layerId);
			}

			state.lyrs = lyrsArray.join(',');

			hash(ioQuery.objectToQuery(state));

		},

		changeView: function (view) {
			topic.publish('changeView', view);
		}

	};

});