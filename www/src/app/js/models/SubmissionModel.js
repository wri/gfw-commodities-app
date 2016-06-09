/* global define */
define([
        'dojo/_base/declare',
        'map/config',
        'knockout'
    ],
    function(declare, MapConfig, ko) {

        var Model = declare(null, {
            constructor: function(el) {
                Model.vm = {};
                Model.root = el;

                Model.vm.storyNameData = ko.observable();
                Model.vm.storyCompanyData = ko.observable();
                Model.vm.storyTitleData = ko.observable();
                Model.vm.storyEmailData = ko.observable();
                Model.vm.storyDetailsData = ko.observable();

                Model.vm.dataFileName = ko.observable();
                Model.vm.dataFileType = ko.observable();
                Model.vm.attributeFileName = ko.observable();
                Model.vm.attributeFileType = ko.observable();

                // Submission Dialog Items
                Model.vm.submissionModalHeader = ko.observable(MapConfig.submissionDialog.submissionModalHeader);
                Model.vm.submissionEnterButton = ko.observable(MapConfig.submissionDialog.submissionEnterButton);
                Model.vm.submissionPlaceholder = ko.observable(MapConfig.submissionDialog.submissionPlaceholder);
                // Model.vm.longitudePlaceholder = ko.observable(MapConfig.submissionDialog.longitudePlaceholder);


                Model.vm.mediaChange = function(obj, evt) {
                  require(['controllers/SubmissionController'], function(SubmissionController) {
                      SubmissionController.handleFileChange(obj, evt);
                  });
                };

                // Model.vm.mediaChange2 = function(obj, evt) {
                //   require(["controllers/SubmissionController"], function(SubmissionController) {
                //       SubmissionController.handleFileChange(obj, evt);
                //   });
                // }

                Model.vm.dataSubmit = function(obj) {
                    require(['controllers/SubmissionController'], function(SubmissionController) {
                        SubmissionController.handleDataSubmit(obj);
                    });
                };

                // Apply Bindings upon initialization
                ko.applyBindings(Model.vm, document.getElementById(el));

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
