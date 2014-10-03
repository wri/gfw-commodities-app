define([
	"dojo/hash",
	"dojo/io-query",
	"dojo/topic",
	"dojo/_base/array",
    "dojo/query"
], function (hash, ioQuery, topic, arrayUtils, query) {
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
			return key ? ioQuery.queryToObject(hash())[key] : ioQuery.queryToObject(hash());
		},

		setHash: function (key, value) {
			var state = ioQuery.queryToObject(hash());
			state[key] = value;
			hash(ioQuery.objectToQuery(state));
		},

    setHashFromState: function (state) {
    	// We dont wont to overwrite the lyrs part of the hash,
    	// We need to hold on to that and make sure it is mixed in
    	// Discuss with Jason, May need to find another way to implement 
    	// this so it does not mess up his features, or we should probably
    	// stash them and only bring them back when were in the map view
    	var currentHash = this.getHash();
    	if (currentHash.lyrs) {
    		state.lyrs = currentHash.lyrs;
    	}

      hash(ioQuery.objectToQuery(state));
    },

    removeKey: function (key) {
      var state = ioQuery.queryToObject(hash());
      if (state[key]){
          delete state[key];
      }
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