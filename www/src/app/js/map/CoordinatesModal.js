define([
  // My Modules
  'map/config',
  'map/Symbols',
  'utils/GeoHelper',
  'analysis/config',
  'analysis/WizardStore',
  'actions/WizardActions',
  // Dojo Modules
  'dojo/on',
  'dojo/dom-class'//,
  // Esri Modules
  // 'esri/graphic',
  // 'esri/geometry/Point'
], function (MapConfig, Symbols, GeoHelper, AnalysisConfig, WizardStore, WizardActions, on, domClass) {

  var closeHandle;

  // var KEYS = AnalysisConfig.STORE_KEYS;

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
      if (closeHandle) {
        closeHandle.remove();
        closeHandle = undefined;
      }
      return domClass.remove('coordinates-modal', 'active');
    },

    resetForm: function () {
      document.getElementById('coordsModalLatitiude').value = '';
      document.getElementById('coordsModalLongitude').value = '';
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
      attributes.isRSPO = false;

      feature = GeoHelper.generatePointGraphicFromGeometric(longitude, latitude, attributes);
      WizardActions.addCustomFeatures([feature]);
      app.map.centerAndZoom(feature.geometry, 7);
      this.resetForm();
      this.close();
    }

  };

  return CoordsModal;

});
