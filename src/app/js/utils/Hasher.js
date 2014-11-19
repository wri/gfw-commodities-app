define([
    "dojo/hash",
    "dojo/io-query",
    "dojo/topic",
    "dojo/_base/array",
    "dojo/query"
], function(hash, ioQuery, topic, arrayUtils, query) {
    'use strict';

    var currentView,
        currentX,
        currentY,
        currentL;


    return {
        // Grab initial hash or set initial hash to home and return current view
        init: function() {
            var state = ioQuery.queryToObject(hash()),
                defaultView = 'home',
                self = this;
            //state['x'];
            //state['y'];

            if (state.hasOwnProperty('v')) {
                defaultView = state.v;
            } else {
                state.v = 'home';
                hash(ioQuery.objectToQuery(state));
            }

            currentView = state.v;
            currentX = state.x;
            currentY = state.y;
            currentL = state.l;
            topic.subscribe("/dojo/hashchange", function(changedHash) {
                var oldState = state;

                state = ioQuery.queryToObject(changedHash);
                console.log(state);

                if (state.x !== currentX && state.v == "map") {
                    self.handleHashChange(state, oldState);
                    debugger;
                }
                // If x or y changes, we should trigger a handleHashChange function that enables back button functionality (storing of the old state; which also helps with sharing that specific url)

                // If view has not changed, do nothing
                if (state.v === currentView) {
                    return;
                }
                currentView = state.v;
                self.changeView(currentView);

            });
            return defaultView;
        },

        handleHashChange: function(newState, oldState) {
            var that = this;
            debugger;
            //o.newState = newState;
            //var changedView = oldState.v != newState.v;
            //var mapView = newState.v == "map";
            var centerChange = ((oldState.x != newState.x) || (oldState.y != newState.y) || (oldState.y != newState.y));
            //var centerChange = 
            //handle different scenarios here
            // if (changedView) {
            //     that.changeView(newState.v, oldState.v);
            // }
            //if (mapView && centerChange) {
            EventsController.centerChange(newState);
            MapController.centerChange();
            //}
            //currentState = newState; //important

        },

        getHash: function(key) {
            return key ? ioQuery.queryToObject(hash())[key] : ioQuery.queryToObject(hash());
        },

        setHash: function(key, value) {
            var state = ioQuery.queryToObject(hash());
            state[key] = value;
            hash(ioQuery.objectToQuery(state));
        },

        setHashFromState: function(state) {
            // We dont wont to overwrite the lyrs part of the hash,
            // We need to hold on to that and make sure it is mixed in
            // Discuss with Jason, May need to find another way to implement 
            // this so it does not mess up his features, or we should probably
            // stash them and only bring them back when were in the map view

            var currentHash = this.getHash();
            if (currentHash.x) {
                state.x = currentHash.x;
                state.y = currentHash.y
                state.l = currentHash.l;
            }
            if (currentHash.lyrs) {
                state.lyrs = currentHash.lyrs;
            }

            hash(ioQuery.objectToQuery(state));
        },

        removeKey: function(key) {
            var state = ioQuery.queryToObject(hash());
            if (state[key]) {
                delete state[key];
            }
            hash(ioQuery.objectToQuery(state));
        },

        toggleLayers: function(layerId) {
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

        getLayers: function() {
            var layers = ioQuery.queryToObject(hash()).lyrs;
            return layers ? layers.split(',') : [];
        },

        removeLayers: function(value) {
            var state = ioQuery.queryToObject(hash()),
                layers = state.lyrs.split(',');

            layers.splice(layers.indexOf(value), 1);
            state.lyrs = layers.join(",");

            hash(ioQuery.objectToQuery(state));

        },

        changeView: function(view) {
            topic.publish('changeView', view);
        }

    };

});