/* global define */
define([
  "dojo/_base/declare",
  "main/config",
  "knockout"
],
function (declare, AppConfig, ko) {

  var Model = declare(null, {

    constructor: function (el) {
      Model.vm = {};
      Model.root = el;

      // Create Model Properties
      Model.vm.showDMSInputs = ko.observable(true);
      Model.vm.showLatLongInputs = ko.observable(false);
      Model.vm.showBasemapGallery = ko.observable(false);
      Model.vm.showLocatorOptions = ko.observable(false);
      Model.vm.showClearPinsOption = ko.observable(false);
      Model.vm.showLayerControls = ko.observable(false);

      // Header Properties
      // Model.vm.forestUse = ko.observable(false);
      // Model.vm.forestCover = ko.observable(false);
      // Model.vm.forestChange = ko.observable(false);
      // Model.vm.conservation = ko.observable(false);
      // Model.vm.agroSuitability = ko.observable(false);
      // Model.vm.filterTitle = ko.observable("");

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