define([
  'utils/assert',
  'analysis/config',
  'analysis/WizardStore'
], function (assert, AnalyzerConfig, Store) {
  'use strict';

  var KEYS = AnalyzerConfig.STORE_KEYS;

  return {
    /**
    * Remove a feature from the Selected Features list by field with the provided value
    * this function is not greedy so the value provided should be unique, it will bail after first match
    * @param {string} field - field name we will be using for matching
    * @param {string} value - Value to match to the provided field
    */
    removeSelectedFeatureByField: function (field, value) {
      assert(field && value, 'removeSelectedFeatureByField - Invalid Parameters');

      var selectedFeatures = Store.get(KEYS.selectedCustomFeatures),
          featureRemoved,
          index;

      featureRemoved = selectedFeatures.some(function (feature, index) {
        if (feature.attributes[field] === value) {
          selectedFeatures.splice(index, 1);
          return true;
        }
      });

      if (featureRemoved) {
        Store.set(KEYS.selectedCustomFeatures, selectedFeatures);
      }

    },

    /**
    * Add a graphic to the store
    * @param {array} graphics - Array of Esri Graphic object to add to the list
    */
    addSelectedFeatures: function (graphics) {
      assert(graphics !== undefined, 'addSelectedFeature - Invalid Parameters');

      var selectedFeatures = Store.get(KEYS.selectedCustomFeatures);
      selectedFeatures = selectedFeatures.concat(graphics);
      Store.set(KEYS.selectedCustomFeatures, selectedFeatures);
    }

  };

});
