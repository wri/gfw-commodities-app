/* global define */
define([
        "dojo/_base/declare",
        "dojo/dom",
        "main/config",
        "knockout"
    ],
    function(declare, dom, AppConfig, ko) {

        var Model = declare(null, {
            constructor: function(el) {
                var o = {};

                o.vm = {};

                var vm = o.vm;
                vm.root = el;

                vm.provincesAvailableForAlerts = ko.observableArray([]);
                vm.districtsAvailableForAlerts = ko.observableArray([]);
                vm.subDistrictsAvailableForAlerts = ko.observableArray([]);
                vm.errorMessages = ko.observableArray([]);
                vm.showErrorMessages = ko.observable(false);
                vm.showSubDistrictWarning = ko.observable(false);

                vm.appState = ko.observable({});


                // Create Model Properties
                //vm.homeModeOptions = ko.observableArray(AppConfig.homeModeOptions);
                console.log(AppConfig.homeModeOptions);


                // vm.modeSelect = function(obj, evt) {
                //     var eventName = obj.eventName;
                //     require(["controllers/HomeController"], function(HomeController) {
                //         HomeController.handleModeClick(eventName);
                //     })
                // }



                // Apply Bindings upon initialization
                o.applyBindings = function(domId) {
                    ko.applyBindings(vm, dom.byId(domId));
                };
            }

        });

        Model.get = function(item) {
            return item === 'model' ? Model.vm : Model.vm[item]();
        };

        Model.set = function(item, value) {
            Model.vm[item](value);
        };

        Model.applyTo = function(el) {
            ko.applyBindings(Model.vm, document.getElementById(el));
        };

        Model.initialize = function(el) {
            if (!Model.instance) {
                Model.instance = new Model(el);
            }
            return Model.instance;
        };

        return Model;

    });