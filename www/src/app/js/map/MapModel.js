/* global define */
define([
  'dojo/_base/declare',
  'main/config',
  'map/config',
  'knockout'
],
function (declare, AppConfig, MapConfig, ko) {

  var Model = declare(null, {

    constructor: function (el) {
      Model.vm = {};
      Model.root = el;

      // Create Model Properties
      Model.vm.showDMSInputs = ko.observable(true);
      Model.vm.showLatLongInputs = ko.observable(false);
      Model.vm.showBasemapGallery = ko.observable(false);
      Model.vm.showLocatorOptions = ko.observable(false);
      Model.vm.showSharingOptions = ko.observable(false);
      Model.vm.showClearPinsOption = ko.observable(false);
      Model.vm.currentLatitude = ko.observable();
      Model.vm.currentLongitude = ko.observable();

      // Storage of Custom Suitability Settings
      Model.vm.suitabilitySettings = ko.observable(MapConfig.customSuitabilityDefaults);

      // Upload Dialog Items
      Model.vm.uploadModalHeader = ko.observable(MapConfig.uploadForm.title);
      Model.vm.shapefileUploadInstructionHeader = ko.observable(MapConfig.uploadForm.shapefileHeader);
      Model.vm.csvUploadInstructionHeader = ko.observable(MapConfig.uploadForm.csvHeader);
      Model.vm.shapefileInstructions = ko.observableArray(MapConfig.uploadForm.shapefileInstructions);
      Model.vm.csvInstructions = ko.observable(MapConfig.uploadForm.csvInstructions);

      // Coordinates Dialog Items
      Model.vm.coordinatesModalHeader = ko.observable(MapConfig.coordinatesDialog.coordinatesModalHeader);
      Model.vm.coordinatesEnterButton = ko.observable(MapConfig.coordinatesDialog.coordinatesEnterButton);
      Model.vm.latitudePlaceholder = ko.observable(MapConfig.coordinatesDialog.latitudePlaceholder);
      Model.vm.longitudePlaceholder = ko.observable(MapConfig.coordinatesDialog.longitudePlaceholder);

      // Tree Cover Density Items
      Model.vm.tcdModalLabel = ko.observable(MapConfig.tcdModal.label);
      Model.vm.tcdDensityValue = ko.observable(MapConfig.tcdModal.densityValue);

      // Storage of specific objects for Wizard
      // Admin Unit
      Model.vm.allCountries = ko.observableArray([]);
      Model.vm.lowerLevelAdminUnits = ko.observableArray([]);
      Model.vm.drawToolsEnabled = ko.observable(false);

      // Apply Bindings upon initialization
      ko.applyBindings(Model.vm, document.getElementById(el));
    }

  });

  Model.get = function (item) {
    return item === 'model' ? Model.vm : Model.vm[item]();
  };

  Model.set = function (item, value) {
    Model.vm[item](value);
  };

  Model.applyTo = function(el) {
    ko.applyBindings(Model.vm, document.getElementById(el));
  };

  Model.initialize = function (el) {
    if (!Model.instance) {
      Model.instance = new Model(el);
    }
    return Model.instance;
  };

  return Model;

});
