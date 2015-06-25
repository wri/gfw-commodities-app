define([
  'esri/request'
], function (request) {
  'use strict';

  return {
    /**
    * Simple wrapper around esri request
    * @param {string} url - Url of the service
    * @param {object} content - options to be sent with the request
    * @param {function} callback - function triggered after successful request
    * @param {function} errback - function triggered after failed request
    */
    get: function (url, content, callback, errback) {
      var deferred = request({
        callbackParamName: 'callback',
        content: content,
        handleAs: 'json',
        url: url
      });
      deferred.then(callback, errback);
    },

    /**
    * Simple wrapper around esri request that specifically calls compute histograms
    * @param {string} url - Url of the service
    * @param {object} content - options to be sent with the request
    * @param {function} callback - function triggered after successful request
    * @param {function} errback - function triggered after failed request
    */
    computeHistogram: function (url, content, callback, errback) {
      var deferred = request({
        url: url + '/computeHistograms',
        callbackParamName: 'callback',
        content: content,
        handleAs: 'json',
        timeout: 60000
      }, { usePost: true });
      deferred.then(callback, errback);
    }

  };

});
