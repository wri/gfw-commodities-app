define([
	'react',
	'components/alertsForm/config',
	'analysis/config',
	'analysis/WizardStore',
	'esri/units',
	'esri/Color',
	'esri/graphic',
	'esri/request',
	'esri/toolbars/draw',
	'esri/geometry/Point',
	'esri/geometry/Extent',
	'esri/geometry/Circle',
	'esri/geometry/Polygon',
	'esri/geometry/scaleUtils',
	'esri/symbols/SimpleFillSymbol',
	'esri/symbols/SimpleLineSymbol',
	'dojo/dom',
	'dojo/query',
	'dojo/dom-class',
	'map/config',
	'map/MapModel'
], function(React, AlertsConfig, AnalyzerConfig, WizardStore, Units, Color, Graphic, esriRequest, Draw, Point, Extent, Circle, Polygon, scaleUtils, SimpleFillSymbol, SimpleLineSymbol, dom, dojoQuery, domClass, MapConfig, MapModel) {

	var AlertsForm,
		graphicsLayer,
		drawToolbar,
		activeTool,
		customFeatureSymbol = new SimpleFillSymbol(AlertsConfig.customFeatureSymbol),
		KEYS = AlertsConfig.STORE_KEYS,
		getDefaultState,
		self = this;

	getDefaultState = function() {
		return {
			graphics: WizardStore.get('customFeatures'),
			showUploadTools: false
		}
	}

	AlertsForm = React.createClass({

		getInitialState: getDefaultState,

		componentDidMount: function() {
			// Initialize
			drawToolbar = new Draw(app.map);
			drawToolbar.on('draw-end', this._drawComplete);
			graphicsLayer = app.map.getLayer(MapConfig.customGraphicsLayer.id);

			WizardStore.registerCallback('customFeatures', function() {
				this.setState({graphics: WizardStore.get('customFeatures')});
			}.bind(this));

			this.setState(getDefaultState());
		},

		componentWillReceiveProps: function(newProps) {
			// update state with newly received props
			if (newProps.isResetting) {
				this.replaceState(getDefaultState());
				// this._disableUploadTools();
				this._deactivateToolbar();
				// this._removeActiveClass();
			}
		},

		render: function() {
			return (
				React.DOM.div({className: 'alerts-form-root'},
					// Header
					React.DOM.div({className: 'alerts-form-header'},
						React.DOM.div({className: 'padding'}, 'Alerts Registration'),
						React.DOM.button({className: 'absolute no-top no-right'}, 'x')
					),
					// Body
					React.DOM.div({className: 'alerts-form-body'}, 
						// Tools
						React.DOM.div({'className':'padding__wide padding__top'},
							React.DOM.div({'className':'margin__bottom'}, 'Create a custom Area'),
							React.DOM.div(null, AnalyzerConfig.customArea.instructions),
							React.DOM.div({'className':'text-center'},
								React.DOM.button({'onClick': this._activateToolbar, 'data-geometry-type': Draw.FREEHAND_POLYGON}, 'Freehand'),
								React.DOM.button({'onClick': this._activateToolbar, 'data-geometry-type': Draw.POLYGON}, 'Polygon'),
								React.DOM.button({'onClick': this._showUploadTools, 'id':'alerts-draw-upload' }, 'Upload')
							),
							React.DOM.div({'className':  (this.state.showUploadTools ? '' : 'hidden')},
								React.DOM.ul({'className': 'upload-instructions'},
									AnalyzerConfig.customArea.uploadInstructions.map(this._instructionsMapper)
								),
								React.DOM.form({'enctype': 'multipart/form-data', 'name':'alertsUploadForm','method': 'post', 'id': 'alertsUploadForm', 'onChange': this._uploadShapefile},
									React.DOM.label(null,
										React.DOM.input({'type': 'file', 'name': 'file', 'id': 'alertsShapefileUploader'})
									)
								),
								React.DOM.div({'id': 'alerts-upload-select-boxes'})
							)
						),
						// Areas
						React.DOM.div({'className':'text-right padding__wide'},
							React.DOM.button(null, 'Toggle'),
							React.DOM.button({'className': 'clear-custom-features', 'onClick': this._clearFeatures}, 'Clear')
						),
						React.DOM.div({'className':'absolute no-wide', 'style': {border:'1px solid #DDDDDD', top: '210px', bottom:'151px'}},
							this.state.graphics.map(this._graphicsMapper, this)
						),
						// Subscription options
						React.DOM.div({'className':'absolute no-wide border-box padding__wide', 'style': {height:'80px', bottom:'51px'}},
							React.DOM.div(null,
								React.DOM.input({type: 'checkbox', name:'forma-alerts'}),
								React.DOM.label({htmlFor: 'forma-alerts'}, 'Monthly Clearance Alerts')
							),
							React.DOM.div(null,
								React.DOM.input({type: 'checkbox', name:'fire-alerts'}),
								React.DOM.label({htmlFor: 'fire-alerts'}, 'Fire Alerts')
							),
							React.DOM.div(null,
								React.DOM.input({placeholder:'something@gmail.com'})
							)
						)
						// TODO: honeypot
					),
					// Footer
					React.DOM.div({className: 'alerts-form-footer'}, 
						'Current Selection:',
						'{selection}',
						React.DOM.button({className: 'float-right'}, 'Subscribe')
					)
				)
			);
		},

		_graphicsMapper: function(graphic, index) {
			// TODO: replace with KEYS reference

			return (
				React.DOM.div(null,
					React.DOM.input({
						'type': 'checkbox',
						'onChange': this._removeFeature,
						'data-index': index
					}),
					React.DOM.input({
						'className':'custom-feature-label',
						'type': 'text',
						'placeholder': 'Feature name',
						'size': graphic.attributes[AnalyzerConfig.stepTwo.labelField].length - 3,
						'value': graphic.attributes[AnalyzerConfig.stepTwo.labelField],
						'data-feature-index': index,
						'data-feature-id': graphic.attributes.WRI_ID,
						'onChange': this._renameFeature
					})
				)
			)
		},

		_removeFeature: function(evt) {
			var index = parseInt(evt.target.dataset ? evt.target.dataset.index : evt.target.getAttribute("data-geometry-index")),
				spliceArgs = [index, 1]
				updatedArray = WizardStore.get('customFeatures'),
				graphic = Array.prototype.splice.apply(updatedArray, spliceArgs)[0];

			WizardStore.set('customFeaturesSpliceArgs', spliceArgs);
			WizardStore.set('customFeatures', updatedArray);
			return graphic;
		},


		_renameFeature: function(evt) {
			var graphic = this._removeFeature(evt);

			graphic.attributes[AnalyzerConfig.stepTwo.labelField] = evt.target.value;

			WizardStore.appendArray('customFeatures', graphic);
			if (evt.target.parentNode.className.split(' ').indexOf('active') > -1) {
				WizardStore.set('analysisArea', graphic);
			}
		},

		_clearFeatures: function () {
			customFeatures = [];
			WizardStore.set('customFeatures', []);
			// Deactivate all the tools if active
			this._deactivateToolbar();
			this._removeActiveClass();
		},

		_instructionsMapper: function (item) {
			return React.DOM.li(null, item);
		},

		_activateToolbar: function (evt) {
			var geometryType;

			geometryType = evt.target.dataset ? evt.target.dataset.geometryType : evt.target.getAttribute("data-geometry-type")

			// If any other tools are active, remove the active class
			this._removeActiveClass();

			// Hide the Upload tools if visible
			this.setState({
				showUploadTools: false
			});

			// If they clicked the same button twice, deactivate the toolbar
			if (activeTool === geometryType) {
				this._deactivateToolbar();
				return;
			}

			activeTool = geometryType

			drawToolbar.activate(geometryType);
			domClass.add(evt.target, "active");

			// Update the Model so other parts of the application can be aware of this
			MapModel.set('drawToolsEnabled', true);
		},

	_showUploadTools: function (evt) {

	  if(domClass.contains(evt.target, 'active')) {
		this._disableUploadTools();
	  } else {
		domClass.add(evt.target, 'active');
		this.setState({
		  showUploadTools: true
		});
	  }

	  // If one of the other tools is active, deactivate it and remove active classes from other tools
	  if (activeTool) {
		this._deactivateToolbar();
		// TODO: fix references to function on non-id hook
		// dojoQuery(".drawing-tool-button").forEach(function (node) {
		//   if (node.id !== evt.target.id) {
		//     domClass.remove(node, "active");
		//   }
		// });
	  }

	},

	// _uploadShapefile: function (evt) {

	//   if (evt.target.value === "") {
	//     // Form was reset so ignore onChange event
	//     return;
	//   }

	//   var filename = evt.target.value.toLowerCase(),
	//       self = this,
	//       params,
	//       extent;

	//   // Filename is full path so extract the filename if in IE
	//   if (sniff("ie")) {
	//     var temp = filename.split("\\");
	//     filename = temp[temp.length - 1];
	//   }

	//   if (filename.indexOf('.zip') < 0) {
	//     alert(AnalyzerConfig.customArea.incorrectFileTypeError);
	//     return;
	//   }

	//   // Split based on .
	//   filename = filename.split(".");

	//   //Chrome and IE add c:\fakepath to the value - we need to remove it
	//   //See this link for more info: http://davidwalsh.name/fakepath
	//   filename = filename[0].replace("c:\\fakepath\\", "");

	//   params = {
	//     'name': filename,
	//     'targetSR': app.map.spatialReference,
	//     'maxRecordCount': 1000,
	//     'reducePrecision': true,
	//     'numberOfDigitsAfterDecimal': 0,
	//     'enforceInputFileSizeLimit': true,
	//     'enforceOutputJsonSizeLimit': true
	//   };

	//   // Generalize Features, based on https://developers.arcgis.com/javascript/jssamples/portal_addshapefile.html
	//   extent = scaleUtils.getExtentForScale(app.map, 40000);
	//   params.generalize = true;
	//   params.maxAllowableOffset = extent.getWidth() / app.map.width;

	//   esriRequest({
	//     url: AnalyzerConfig.customArea.portalUrl,
	//     content: {
	//       'filetype': 'shapefile',
	//       'publishParameters': JSON.stringify(params),
	//       'f': 'json',
	//       'callback.html': 'textarea'
	//     },
	//     form: dom.byId('uploadForm'),
	//     handleAs: 'json',
	//     load: self._uploadSuccess,
	//     error: self._uploadError
	//   });

	// },

	// _uploadError: function (err) {
	//   alert("Error: " + err.message);
	// },

	// _uploadSuccess: function (res) {

	//   // Create Items for DropDown boxes
	//   var locationNode = dom.byId("upload-select-boxes"),
	//       featureCollection = res.featureCollection,
	//       uploadedFeatureStore = [],
	//       containsPointData,
	//       self = this,
	//       chosenName,
	//       store;

	//   // Create a store of Data
	//   featureCollection.layers[0].layerDefinition.fields.forEach(function (field) {
	//     uploadedFeatureStore.push({
	//       name: field.name,
	//       id: field.alias
	//     });
	//   });

	//   containsPointData = featureCollection.layers[0].featureSet.geometryType === "esriGeometryPoint";

	//   // function that will assist in the cleanup once a selection is made
	//   function resetView() {
	//     if (registry.byId("uploadComboRadiusWidget")) {
	//       registry.byId("uploadComboRadiusWidget").destroy();
	//     }
	//     if (dom.byId("dropdownContainerRadius")) {
	//       domConstruct.destroy("dropdownContainerRadius");
	//     }
	//     if (registry.byId("uploadComboNameWidget")) {
	//       registry.byId("uploadComboNameWidget").destroy();
	//     }
	//     if (dom.byId("dropdownContainerName")) {
	//       domConstruct.destroy("dropdownContainerName");
	//     }
	//     self._disableUploadTools();
	//   }

	//   // Create Containers for DropDowns
	//   domConstruct.create("div", {
	//     'id': 'dropdownContainerRadius',
	//     'innerHTML': '<div id="uploadComboRadiusWidget"></div>'
	//   }, locationNode, "after");

	//   domConstruct.create("div", {
	//     'id': 'dropdownContainerName',
	//     'innerHTML': '<div id="uploadComboNameWidget"></div>'
	//   }, locationNode, "after");

	//   // Create a Memory Store for both Dropdowns
	//   store = new Memory({
	//     data: uploadedFeatureStore
	//   });

	//   // Create the DropDowns finally and handle onChange behavior
	//   new ComboBox({
	//     id: "uploadComboNameWidget",
	//     value: "-- Choose name field --",
	//     store: store,
	//     searchAttr: "name",
	//     onChange: function (name) {
	//       if (name && !containsPointData) {
	//         self._addFeaturesToMapFromShapefile(featureCollection.layers[0].featureSet, name);
	//         resetView();
	//       } else if (containsPointData && name) {
	//         chosenName = name;
	//         addRadiusDropdown();
	//       } else {
	//         resetView();
	//       }
	//     }
	//   }, "uploadComboNameWidget");

	//   function addRadiusDropdown() {

	//     var dataStore = [
	//       { name: '10 kilometers', id: '10km',},
	//       { name: '20 kilometers', id: '20km'},
	//       { name: '30 kilometers', id: '30km'},
	//       { name: '40 kilometers', id: '40km'},
	//       { name: '50 kilometers', id: '50km'}
	//     ];

	//     store = new Memory({
	//       data: dataStore
	//     });

	//     new ComboBox({
	//       id: "uploadComboRadiusWidget",
	//       value: "-- Choose a Radius --",
	//       store: store,
	//       searchAttr: "name",
	//       onChange: function (radius) {
	//         if (radius) {
	//           self._addFeaturesToMapFromShapefile(featureCollection.layers[0].featureSet, chosenName, radius);
	//         }
	//         resetView();
	//       }
	//     }, "uploadComboRadiusWidget");

	//   }
	  
	// },

	// _addFeaturesToMapFromShapefile: function (featureSet, labelName, radius) {

	//   var counter = this._nextAvailWRI_ID(),
	//       defaultRadius = 50,
	//       tempExtent,
	//       geometry,
	//       graphic,
	//       extent,
	//       temp,
	//       lat,
	//       lon;

	//   // If radius is provided, parseInt to get the raw value
	//   if (radius) {
	//     radius = parseInt(radius);
	//     if (isNaN(radius)) {
	//       radius = defaultRadius;
	//     }
	//   }

	//   // Add the appropriate attribtue that is used for labeling, and WRI_ID
	//   // Then add the graphic to the map and to the customFeatures list
	//   featureSet.features.forEach(function (feature, index) {
	//     feature.attributes[AnalyzerConfig.stepTwo.labelField] = "ID - " + (counter + index) + ": " + feature.attributes[labelName];
	//     feature.attributes.WRI_ID = (counter + index);
	//     // If its a point, create a point, else create a polygon, test if it has an x coordinate
	//     if (feature.geometry.x) {
	//       temp = new Point(feature.geometry);
	//       geometry = new Circle(temp, { radius: radius, radiusUnit: Units.KILOMETERS });
	//       tempExtent = new Extent(temp.x, temp.y, temp.x, temp.y, temp.spatialReference);
	//       extent = extent ? extent.union(tempExtent) : tempExtent;
	//     } else {
	//       geometry = new Polygon(feature.geometry);
	//       extent = extent ? extent.union(geometry.getExtent()) : geometry.getExtent();
	//     }
	//     graphic = new Graphic(geometry, customFeatureSymbol, feature.attributes);
	//     customFeatures.push(graphic);
	//     graphicsLayer.add(graphic);

	//   });

	//   app.map.setExtent(extent, true);
	//   // Update the UI
	//   this.setState({
	//     graphics: customFeatures
	//   });

	// },

	_drawComplete: function (evt) {
		this._removeActiveClass();
		this._deactivateToolbar();

		if (!evt.geometry) {
			return;
		}

		// WRI_ID = Unique ID for Drawn Graphics
		var id = this._nextAvailWRI_ID(),
			attrs = { "WRI_ID": id },
			graphic;

		// Add a Label
		attrs[AnalyzerConfig.stepTwo.labelField] = "ID - " + id + ": Custom drawn feature";
		graphic = new Graphic(evt.geometry, customFeatureSymbol, attrs);

		WizardStore.appendArray('customFeatures', graphic);
	},

	_deactivateToolbar: function () {
		drawToolbar.deactivate();
		activeTool = undefined;
		MapModel.set('drawToolsEnabled', false);
	},

	_disableUploadTools: function () {
		// fix id reference

		dom.byId("alertsShapefileUploader").value = "";
		domClass.remove("alerts-draw-upload", "active");
		this.setState({
			showUploadTools: false
		});
	},

	_removeActiveClass: function () {
		dojoQuery(".drawing-tools .drawing-tool-button").forEach(function (node) {
			domClass.remove(node, "active");
		});
	},

	// _chooseGraphic: function (evt) {
	//   var id = evt.target.dataset ? evt.target.dataset.featureId : evt.target.getAttribute("data-feature-id"),
	//       self = this;
	//   graphicsLayer.graphics.forEach(function (g) {
	//     if (g.attributes.WRI_ID === parseInt(id)) {
	//       GeoHelper.zoomToFeature(g);
	//       // Pass the Feature to Component StepTwo.js, he will update his state to completed is true, and he will 
	//       // have a feature to display in the Current feature for analysis section
	//       self.props.callback.updateAnalysisArea(g);
	//     }
	//   });
	// },

	_nextAvailWRI_ID: function() {
		var i = 0,
			x = 0,
			graphics = WizardStore.get('customFeatures'),
			length = graphics.length,
			temp;

		for (i; i < length; i++) {
			if (graphics[i].geometry.type !== "point") {
				temp = parseInt(graphics[i].attributes.WRI_ID);
				if (!isNaN(temp)) {
					x = (x > temp) ? x : temp;
				}
			}
		}
		return (x + 1);
	}

// ///////////////////////////////

	});

	return function(props, el) {
		return React.renderComponent(new AlertsForm(props), document.getElementById(el));
	};

});