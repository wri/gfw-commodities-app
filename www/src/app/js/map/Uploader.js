define([
	'map/config',

	'dojo/on',
	'dojo/sniff',
	'dojo/dom-class',
	'dijit/registry',
	'dojo/store/Memory',
	'dojo/dom-construct',
	'dijit/form/ComboBox',

	'esri/request',
	'esri/geometry/scaleUtils'
], function (MapConfig, on, sniff, domClass, registry, Memory, domConstruct, ComboBox, esriRequest, scaleUtils) {
	'use strict';

	var closeHandle;

	var Uploader = {

		/**
		* Toggle the Upload Panel
		*/
		toggle: function () {
			domClass.toggle('upload-modal', 'active');

			if (closeHandle) {
				closeHandle.remove();
				closeHandle = undefined;
			} else {
				closeHandle = on.once(document.querySelector('#upload-modal .close-icon'), 'click', this.toggle);
			}

		},

		/**
		* Receive the Form event and delegate to the appropriate method
		* @param {object} evt - Event emitted by the form onChange
		*/
		beginUpload: function (evt) {
			if (evt.target.value === '') {
				// Form was reset so just return
				return;
			}

			var filename = evt.target.value.toLowerCase();
			// Filename is full path so extract the filename if in IE
			if (sniff('ie')) {
				var temp = filename.split('\\');
				filename = temp[temp.length - 1];
			}

			if (filename.indexOf('.zip') < 0) {
				this.uploadCSV(filename, evt);
			} else {
				this.uploadShapefile(filename, evt);
			}

		},

		/**
		* Upload csv file containing name, latitude, and longitude
		* @param {stirng} filename - name of file to upload
		* @param {object} evt - Event emitted by the form onChange(may not be needed but passed just incase)
		*/
		uploadCSV: function (filename, evt) {

		},

		/**
		* Upload a shapefile containing points or polygons
		* @param {stirng} filename - name of file to upload
		* @param {object} evt - Event emitted by the form onChange(may not be needed but passed just incase)
		*/
		uploadShapefile: function (filename, evt) {

			var params,
					extent;

			// Split the extension off using the . 
			filename = filename.split('.');

			//Chrome and IE add c:\fakepath to the value - we need to remove it
      //See this link for more info: http://davidwalsh.name/fakepath
      filename = filename[0].replace("c:\\fakepath\\", "");

      params = {
      	'name': filename,
      	'targetSR': app.map.spatialReference,
      	'generalize': true,
      	'maxRecordCount': 1000,
      	'reducePrecision': true,
      	'numberOfDigitsAfterDecimal': 0,
      	'enforceInputFileSizeLimit': true,
        'enforceOutputJsonSizeLimit': true
      };

      // Generalize Features, based on https://developers.arcgis.com/javascript/jssamples/portal_addshapefile.html
      extent = scaleUtils.getExtentForScale(app.map, 40000);
      params.maxAllowableOffset = extent.getWidth() / app.map.width;

      esriRequest({
      	url: MapConfig.uploader.portalUrl,
      	content: {
      		'f': 'json',
      		'filetype': 'shapefile',
      		'callback.html': 'callback',
      		'publishParameters': JSON.stringify(params)
      	},
      	form: document.getElementById('upload-form'),
      	handleAs: 'json',
      	load: this.uploadSuccess.bind(this),
      	error: this.uploadError
      });

		},

		/**
		* @param {object} err - Error object emitted from portal upload
		*/
		uploadError: function (err) {
			alert("Error: " + err.message);
		},

		/**
		* @param {object} res - Response from the portal upload
		* @param {object} params - Parameters sent in with the request (prob not needed but here anyway)
		*/
		uploadSuccess: function (res, params) {
			
			var locationNode = document.getElementById('postUploadOptions'),
					featureCollection = res.featureCollection,
					uploadedFeatureStore = [],
          containsPointData,
          self = this,
          chosenName,
          store;

      // Create a store of data
      // Currently this upload only takes the first layer of a shapefile
      // This may need to be reworked to upload multiple layers if needed
      featureCollection.layers[0].layerDefinition.fields.forEach(function (field) {
        uploadedFeatureStore.push({
          name: field.name,
          id: field.alias
        });
      });

      containsPointData = featureCollection.layers[0].featureSet.geometryType === "esriGeometryPoint";

      // Create containers for Dropdowns
      domConstruct.create('div', {
      	'id': 'uploadNameField',
      	'innerHTML': '<div id="uploadNameFieldWidget"></div>'
      }, locationNode, 'after');

      store = new Memory({
      	data: uploadedFeatureStore
      });

      new ComboBox({
        id: "uploadNameFieldWidget",
        value: "-- Choose name field --",
        store: store,
        searchAttr: "name",
        onChange: function (name) {
          if (name) {
            self.formatFeaturesToStore(featureCollection.layers[0].featureSet, name);
          }
          self.resetForm();
        }
      }, "uploadNameFieldWidget");

		},

		/**
		* Prepare a feature set to be added to the WizardStore
		* @param {} featureSet - Feature Set
		* @param {string} nameField - Field to be used as the name field
		*/
		formatFeaturesToStore: function (featureSet, nameField) {
			console.dir(featureSet);
		},

		/**
		* Simple Utility function to destroy dijits and reset the form
		*/
		resetForm: function () {
			var nameFieldNode = document.getElementById('uploadNameField');

    	if (registry.byId('uploadNameFieldWidget')) {
    		registry.byId('uploadNameFieldWidget').destroy();
    	}
    	if (nameFieldNode) {
    		domConstruct.destroy(nameFieldNode.id);
    	}

    	document.getElementById('upload-form').reset();
		}


	};

	return Uploader;

});