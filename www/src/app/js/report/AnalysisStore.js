define([

], function () {
  'use strict';

  /**
  * The purpose of this store is to hold on to any data helpful in various places of the report
  * while the report is getting refactored, things will gradually moved over to this and it should
  * only store raw data, not information.
  *
  * Actual store object with some base configurations
  * If the value will never change, then it should be stored in the config, this is for mutable data
  */
  var store = {
    'pixelSize': 100
  };

  return {

    get: function (key) {
      return key ? store[key] : store;
    },

    set: function (key, value) {
      store[key] = value;
    }

  };

});
