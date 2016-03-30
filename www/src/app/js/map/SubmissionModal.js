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

  var SubmitModal = {

    /**
    * Toggle the Panel
    */
    toggle: function () {
      domClass.toggle('submission-modal', 'active');

      if (closeHandle) {
        closeHandle.remove();
        closeHandle = undefined;
      } else {
        closeHandle = on.once(document.querySelector('#submission-modal .close-icon'), 'click', this.toggle);
      }
    },

    /**
    * Add a class
    */
    addClass: function (className) {
      domClass.add('submission-modal', className);
    },

    /**
    * Remove a class
    */
    removeClass: function (className) {
      domClass.remove('submission-modal', className);
    },

    /**
    * Force close
    */
    close: function () {
      if (closeHandle) {
        closeHandle.remove();
        closeHandle = undefined;
      }
      return domClass.remove('submission-modal', 'active');
    },

    resetForm: function () {
      document.getElementById('submitModalLatitiude').value = '';
      document.getElementById('submitModalLongitude').value = '';
    }


  };

  return SubmitModal;

});
