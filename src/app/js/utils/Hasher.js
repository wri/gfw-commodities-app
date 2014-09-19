define([
	"dojo/hash",
	"dojo/io-query",
	"dojo/topic",
	"dojo/_base/array",
], function (hash, ioQuery, topic, arrayUtils) {
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

			/**** <NOTE> Set Default Layers Here, If the default is the radio option none, set in MapConfig.layersUI ****/
			/**** under the appropriate radio button with property, active: true </NOTE> ****/

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
			return key ? ioQuery.queryToObject(hash())[key] : ioQuery.queryToObject(hash());
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

			if (lyrsArray.length === 0) {
				delete state.lyrs;
			} else {
				state.lyrs = lyrsArray.join(',');
			}

			hash(ioQuery.objectToQuery(state));
		},

		getLayers: function () {
			var layers = ioQuery.queryToObject(hash()).lyrs;
			return layers ? layers.split(',') : [];
		},

		removeLayers: function (value) {
			var state = ioQuery.queryToObject(hash()),
					layers = state.lyrs.split(',');

			layers.splice(layers.indexOf(value), 1);
			state.lyrs = layers.join(",");

			hash(ioQuery.objectToQuery(state));
			
		},

		changeView: function (view) {
			topic.publish('changeView', view);
		}

	};

});