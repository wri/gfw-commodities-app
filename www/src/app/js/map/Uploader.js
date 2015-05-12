define([
	// My Modules
	'map/config',
	'map/Symbols',
	'utils/GeoHelper',
	'analysis/config',
  'analysis/WizardStore',
  // Dojo Modules
	'dojo/on',
	'dojo/sniff',
	'dojo/dom-class',
	'dijit/registry',
	'dojo/store/Memory',
	'dojo/dom-construct',
	'dijit/form/ComboBox',
	'dojox/data/CsvStore',
	// Esri Modules
	'esri/request',
	'esri/graphic',
	'esri/geometry/Point',
  'esri/geometry/Extent',
  'esri/geometry/Polygon',
	'esri/geometry/scaleUtils',
	'esri/geometry/webMercatorUtils'
], function (MapConfig, Symbols, GeoHelper, AnalysisConfig, WizardStore, on, sniff, domClass, registry, Memory, domConstruct, ComboBox, CsvStore, esriRequest, Graphic, Point, Extent, Polygon, scaleUtils, webMercatorUtils) {
	'use strict';

	var closeHandle;

	var KEYS = AnalysisConfig.STORE_KEYS;

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
    * Force close
    */
    close: function () {
      if (closeHandle) {
        closeHandle.remove();
        closeHandle = undefined;
      }
      return domClass.remove('upload-modal', 'active');
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
				this.uploadCSV(evt);
			} else {
				this.uploadShapefile(filename, evt);
			}

		},

		/**
		* Upload csv file containing name, latitude, and longitude
		* @param {stirng} filename - name of file to upload
		* @param {object} evt - Event emitted by the form onChange(may not be needed but passed just incase)
		*/
		uploadCSV: function (evt) {
			var file = evt.target.files[0],
					reader = new FileReader(),
					attributeStore = [],
					self = this,
					fileLoaded,
					attributes,
					store;

			fileLoaded = function () {
				// Create a CSV Store and fetch all items from it afterwards
				store = new CsvStore({
					data: reader.result,
					separator: ','
				});

				store.fetch({
					onComplete: function (items) {
						
						if (items.length < 1) {
							throw new Error('No items found in CSV file.');
						}

						attributes = store.getAttributes(items[0]);

						attributes.forEach(function (attr) {
			        attributeStore.push({ name: attr, id: attr });
			      });

			      self.generateDropdown(attributeStore, function (name) {
			      	if (name) {
		            self.formatCSVDataForStore(store, items, name);
		          }
			      });

					},
					onError: self.uploadError
				});

			};

			// Read the CSV File
			reader.onload = fileLoaded;
			reader.readAsText(file);
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
			console.error("Error uplaoding data: ", err);
		},

		/**
		* @param {object} res - Response from the portal upload
		* @param {object} params - Parameters sent in with the request (prob not needed but here anyway)
		*/
		uploadSuccess: function (res, params) {
			
			var featureCollection = res.featureCollection,
					uploadedFeatureStore = [],
          self = this;

      // Create a store of data
      // Currently this upload only takes the first layer of a shapefile
      // This may need to be reworked to upload multiple layers if needed
      featureCollection.layers[0].layerDefinition.fields.forEach(function (field) {
        uploadedFeatureStore.push({
          name: field.name,
          id: field.alias
        });
      });

      self.generateDropdown(uploadedFeatureStore, function (name) {
      	if (name) {
          self.formatFeaturesToStore(featureCollection.layers[0].featureSet, name);
        }
      });

		},

		/**
		* Prepare a csv data store to be pushed to the WizardStore, output format will be esri.Graphic
		* @param {object} store - dojo's CSV Store
		* @param {array} items - Array of items resulting from a fetch on the csv store
		* @param {string} nameField - Field to be used as the name field
		*/
		formatCSVDataForStore: function (store, items, nameField) {
			var counter = GeoHelper.nextCustomFeatureId(),
					newFeatures = [],
					attributes,
					feature,
					attrs,
					value,
					lat,
					lon;

			// Parse the Attribtues
			items.forEach(function (item, index) {
				attributes = {};
				attrs = store.getAttributes(item);
				attrs.forEach(function (attr) {
					value = store.getValue(item, attr);
					attributes[attr] = isNaN(value) ? value : parseFloat(value);
				});

				attributes[MapConfig.uploader.labelField] = 'ID - ' + (counter + index) + ': ' + attributes[nameField];
				attributes.WRI_ID = (counter + index);
        attributes.isRSPO = false;

				// Try to get the Lat and Long from Latitude and Longitude but not case sensitive
				lat = attributes.Latitude ? attributes.Latitude : attributes.latitude;
				lon = attributes.Longitude ? attributes.Longitude : attributes.longitude;

				feature = new Graphic(
					new Point(lon, lat),
					Symbols.getPointSymbol(),
					attributes
				);

				newFeatures.push(feature);
			});
			
			WizardStore.set(KEYS.customFeatures, WizardStore.get(KEYS.customFeatures).concat(newFeatures));

		},

		/**
		* Prepare a feature set to be added to the WizardStore
		* @param {} featureSet - Feature Set
		* @param {string} nameField - Field to be used as the name field
		*/
		formatFeaturesToStore: function (featureSet, nameField) {

			var counter = GeoHelper.nextCustomFeatureId(),
					newFeatures = [],
					geometry,
					graphic,
					extent,
					symbol,
					temp;

			featureSet.features.forEach(function (feature, index) {
				feature.attributes[MapConfig.uploader.labelField] = 'ID - ' + (counter + index) + ': ' + feature.attributes[nameField];
				feature.attributes.WRI_ID = (counter + index);
				// If its a point, create a point, else, create a polygon
        // If it is a point, add a isRSPO field and set it to false
				if (feature.geometry.x) {
					symbol = Symbols.getPointSymbol();
					geometry = new Point(feature.geometry);
					temp = new Extent(geometry.x, geometry.y, geometry.x, geometry.y, geometry.spatialReference);
					extent = extent ? extent.union(temp) : temp;
          feature.attributes.isRSPO = false;
				} else {
					symbol = Symbols.getPolygonSymbol();
					geometry = new Polygon(feature.geometry);
					extent = extent ? extent.union(geometry.getExtent()) : geometry.getExtent();
				}

				graphic = new Graphic(geometry, symbol, feature.attributes);
				newFeatures.push(graphic);

			});

			WizardStore.set(KEYS.customFeatures, WizardStore.get(KEYS.customFeatures).concat(newFeatures));

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
		},

		/**
		* Simple Utility function to create a dropdown to allow the user to choose a name field
		* The data should be an array of objects like {name: '..', id: '..'}
		* @param {array} data - Array of data to create the dropdown with
		* @param {function} callback - Callback to invoke once complete
		*/
		generateDropdown: function (data, callback) {

			var locationNode = document.getElementById('postUploadOptions'),
					self = this,
					store;

			domConstruct.create('div', {
      	'id': 'uploadNameField',
      	'innerHTML': '<div id="uploadNameFieldWidget"></div>'
      }, locationNode, 'last');

      store = new Memory({
      	data: data
      });

      new ComboBox({
        id: "uploadNameFieldWidget",
        value: "-- Choose name field --",
        store: store,
        searchAttr: "name",
        onChange: function (name) {
          self.resetForm();
          self.toggle();
          callback(name);
        }
      }, "uploadNameFieldWidget");

		}


	};

	return Uploader;

});
