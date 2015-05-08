define([
  // My Modules
  'map/config',
  'map/Symbols',
  'utils/GeoHelper',
  'analysis/config',
  'analysis/WizardStore',
  // Dojo Modules
  'dojo/on',
  'dojo/dom-class',
  // Esri Modules
  'esri/graphic',
  'esri/geometry/Point'
], function (MapConfig, Symbols, GeoHelper, AnalysisConfig, WizardStore, on, domClass, Graphic, Point) {
  'use strict';

  var closeHandle;

  var KEYS = AnalysisConfig.STORE_KEYS;

  var CoordsModal = {

    /**
    * Toggle the Upload Panel
    */
    toggle: function () {
      domClass.toggle('coordinates-modal', 'active');

      if (closeHandle) {
        closeHandle.remove();
        closeHandle = undefined;
      } else {
        closeHandle = on.once(document.querySelector('#coordinates-modal .close-icon'), 'click', this.toggle);
      }
    },

    /**
    * Force close
    */
    close: function () {
      return domClass.remove('coordinates-modal', 'active');
    },

    /**
    * Save a point with the coordinates entered by the user
    */
    savePoint: function () {

      var latitude = parseFloat(document.getElementById('coordsModalLatitiude').value),
          longitude = parseFloat(document.getElementById('coordsModalLongitude').value),
          errorMessages = MapConfig.coordinatesDialog.errors,
          id = GeoHelper.nextCustomFeatureId(),
          attributes = {},
          errors = [],
          feature;

      // Check for invalid entry
      if (latitude === '' || isNaN(latitude) || (latitude > 90 || latitude < -90)) {
        errors.push(errorMessages.invalidLatitude);
      }

      if (longitude === '' || isNaN(longitude) || (longitude > 180 || longitude < -180)) {
        errors.push(errorMessages.invalidLongitude);
      }

      // If there is invalid entry, notify the user
      if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
      }

      // Use the same label field as in the Uploader dialog instead of creating duplicate entries in the config
      attributes[MapConfig.uploader.labelField] = 'ID - ' + id;
      attributes.WRI_ID = id;

      feature = new Graphic(
        new Point(longitude, latitude),
        Symbols.getPointSymbol(),
        attributes
      );

      WizardStore.set(KEYS.customFeatures, WizardStore.get(KEYS.customFeatures).concat([feature]));
      this.close();

    }

  };

  return CoordsModal;

});
