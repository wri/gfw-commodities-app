define([

], function () {
	'use strict';

	var Store = {};
	var Callbacks = {};

	var Interface = {

		/**
		* @param {string} key - key of item in store
		*/
		get: function (key) {
			return Store[key];
		},

		/**
		* @param {string} key - key of item in store
		* @param {string} vaule - Item to save in store
		*/
		set: function (key, value) {
			Store[key] = value;
			this.updateSubscribers(key);
		},

		/**
		* @param {string} key - key of item in Callbacks
		* @param {function} callback - callback to trigger on update of store
		*/
		registerCallback: function (key, callback) {
			if (Callbacks[key]) {
				Callbacks[key].push(callback);
			} else {
				Callbacks[key] = [];
				Callbacks[key].push(callback);
			}
		},

		/**
		* @param {string} key - key of Callbacks to invoke
		*/
		updateSubscribers: function (key) {
			var callbacks = Callbacks[key];
			if (callbacks) {
				callbacks.forEach(function (func) {
					func();
				});
			}
		},

		/**
		* log the store to the console so I can inspect it in the app
		*/
		debug: function () {
			console.dir(Store);
		}

	};

	return Interface;

});