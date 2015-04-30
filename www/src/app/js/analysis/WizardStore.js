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
		}

	};

	return Interface;

});