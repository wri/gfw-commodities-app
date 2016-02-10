/** @jsx React.DOM */
define([
	"react",
  "map/config",
  "dojo/topic",
  "dojo/query",
  "map/Uploader",
  "dojo/dom-class",
  "dojo/_base/array",
	"dojo/promise/all",
  "analysis/Query",
  "analysis/config",
  "utils/GeoHelper",
  "map/CoordinatesModal",
  "analysis/WizardStore",
  "components/wizard/NestedList",
  "components/featureList/FeatureList"
], function (React, MapConfig, topic, dojoQuery, Uploader, domClass, arrayUtils, all, AnalyzerQuery, AnalyzerConfig, GeoHelper, CoordinatesModal, WizardStore, NestedList, FeatureList) {

  var config = AnalyzerConfig.millPoints;
  var KEYS = AnalyzerConfig.STORE_KEYS;
  var previousStep;

  var getDefaultState = function () {
    return ({
      nestedListData: [],
      activeListItemValues: [],
      selectedCommodity: config.commodityOptions[0].value,
      showCustomFeaturesList: false,
      selectedCustomFeatures: WizardStore.get(KEYS.selectedCustomFeatures),
      customFeatures: getCustomPointFeatures()
    });
  };

  var getCustomPointFeatures = function () {
    var customFeatures = WizardStore.get(KEYS.customFeatures);
    return customFeatures.filter(function (feature) {
      return feature.geometry.type === 'point';
    });
  };

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      previousStep = WizardStore.get(KEYS.userStep);
      // Register callbacks
      WizardStore.registerCallback(KEYS.userStep, this.userChangedSteps);
      WizardStore.registerCallback(KEYS.customFeatures, this.customFeaturesUpdated);
      WizardStore.registerCallback(KEYS.selectedCustomFeatures, this.selectedCustomFeaturesUpdated);
    },

    shouldComponentUpdate: function () {
      return WizardStore.get(KEYS.userStep) === 2 && WizardStore.get(KEYS.areaOfInterest) === AnalyzerConfig.stepOne.option5.id;
    },

    customFeaturesUpdated: function () {
      var customFeatures = getCustomPointFeatures();
      this.setState({ customFeatures: customFeatures });
    },

    selectedCustomFeaturesUpdated: function () {
      var selectedCustomFeatures = WizardStore.get(KEYS.selectedCustomFeatures);
      this.setState({ selectedCustomFeatures: selectedCustomFeatures });
    },

    userChangedSteps: function () {
      var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
      var currentStep = WizardStore.get(KEYS.userStep);

      // If they are arriving at this step
      if (selectedAreaOfInterest === 'millPointOption' && currentStep === 2) {
        // Get Data if there is none present
        if (this.state.nestedListData.length === 0) {
          this._loadMillPoints();
        }
      }

      // If they are moving forward through the wizard and end up here
      if (selectedAreaOfInterest === 'millPointOption' && previousStep === 1 && currentStep === 2) {
        // If Mill Points is not visible show it and select it in the UI, otherwise do nothing
        var layer = app.map.getLayer(MapConfig.mill.id);
        if (layer) {
          if (!layer.visible) {
            topic.publish('showMillPoints');
            topic.publish('toggleItemInLayerList','mill');
						// topic.publish('showMillPoints');
            topic.publish('toggleItemInLayerList','gfwMill');
          }
        }

        // If this component is appearing in the UI, reset some things and load data if its not available
        // Reset Active List Items for the NestedList
        this.setState({ activeListItemValues: [] });
      }

      previousStep = WizardStore.get(KEYS.userStep);
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
      }
    },

    /* jshint ignore:start */
    render: function () {
      return (
        React.createElement("div", {className: "mill-point", id: "mill-point"}, 
          /* Custom Toggle Switch, mill-list-toggle-indicator has orange background behind active list option */
          React.createElement("div", {className: "mill-list-options back-light-gray relative"}, 
            React.createElement("div", {className: 'mill-list-toggle-indicator mill-' + (this.state.showCustomFeaturesList ? 'custom-list' : 'known-list')}), 
            React.createElement("div", {className: 'relative select-mill-list-button inline-block ' + (this.state.showCustomFeaturesList ? '' : 'active'), 
                  id: "selectFromList", 
                  onClick:  this.toggleList}, 
              config.selectFromListButton
            ), 
            React.createElement("div", {className: 'relative select-mill-list-button inline-block ' + (this.state.showCustomFeaturesList ? 'active' : ''), 
                  id: "selectFromCustom", 
                  onClick:  this.toggleList}, 
              config.selectFromCustomListButton
            )
          ), 
          /* Render this list when user clicks selectFromList */
          React.createElement("div", {className: this.state.showCustomFeaturesList ? 'hidden' : ''}, 
            React.createElement("p", {className: "instructions"}, config.selectInstructions), 
            React.createElement("div", {className: "select-container"}, 
              React.createElement("select", {id: "mill-select", className: "mill-select", value: this.state.selectedCommodity, onChange: this._loadMillPoints}, 
                 config.commodityOptions.map(this._selectMapper, this) 
              )
            ), 
            React.createElement("p", {className: 'instructions' + (this.state.nestedListData.length > 0 ? '' : ' hidden')}, " ", config.listInstructions, " "), 
            React.createElement(NestedList, {data: this.state.nestedListData, 
              click: this._millPointSelected, 
              placeholder: "Search mill points...", 
              activeListItemValues: this.state.activeListItemValues, 
              isResetting: this.props.isResetting}
            )
          ), 
          /* Render this list when user clicks upload or enterCoords */
          React.createElement("div", {className: this.state.showCustomFeaturesList ? '' : 'hidden'}, 
            React.createElement("p", {className: "instructions"}, config.instructions), 
            React.createElement("div", {className: "drawing-tools"}, 
              React.createElement("div", {className: "drawing-tool-button", id: "enterCoords", onClick:  this.drawToolClicked}, config.enterCoordinatesButton), 
              React.createElement("div", {className: "drawing-tool-button", id: "upload", onClick:  this.drawToolClicked}, config.uploadButton)
            ), 
            React.createElement(FeatureList, {features: this.state.customFeatures, selectedFeatures: this.state.selectedCustomFeatures, rspoChecks: true, showClear: true})
          )
        )
      );
    },

    _selectMapper: function (item) {
      return React.createElement("option", {value: item.value}, " ", item.label, " ");
    },
    /* jshint ignore:end */

    toggleList: function (evt){
      var nodeClicked = evt.target.id,
          showCustomFeaturesList;

      showCustomFeaturesList = nodeClicked === 'selectFromCustom' ? true : false;

      // If we aren't showing features from the custom list, make sure to hide both dialogs
      // calling close if the dialog is already closed will do nothing
      if (!showCustomFeaturesList) {
        CoordinatesModal.close();
        Uploader.close();
      }

      // if showCustomFeaturesList is a different value from before, update state and clear selection
      if (this.state.showCustomFeaturesList !== showCustomFeaturesList) {
        this.setState({ showCustomFeaturesList: showCustomFeaturesList });
        this._localReset();
      }

    },

    drawToolClicked: function (evt) {
      // Split off the key and save it here as it is the key to which node was clicked
      var id = evt.target.id;

      switch (id) {
        case "enterCoords":
          Uploader.close();
          CoordinatesModal.toggle();
        break;
        case "upload":
          CoordinatesModal.close();
          Uploader.toggle();
        break;
      }

    },

    _loadMillPoints: function () {

      this.setState({ isLoading: true });

      // Show the features on the map
      var self = this;
      AnalyzerQuery.getMillPointData().then(function (data) {
        if (data) {
          self.setState({ nestedListData: data, isLoading: false });
        }
      });

    },

    _millPointSelected: function (target) {
      var featureType = target.getAttribute('data-type'),
          wriId = target.getAttribute('data-value'),
          selectedFeatures = this.state.selectedCustomFeatures,
          newActiveListItemValues,
          wizardGraphicsLayer,
					wizardPointGraphicsLayer,
          self = this,
					millIds = [],
					millLabels = [],
          removeIndex,
          removeId,
          graphic,
          label;

			wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
			wizardPointGraphicsLayer = app.map.getLayer(MapConfig.wizardPointGraphicsLayer.id);
      if (featureType === "group") {
        // Mills dont support group selection
				// debugger
				for (var i = 0; i < this.state.nestedListData.length; i++) {
					if (this.state.nestedListData[i].value === wriId) {
						for (var j = 0; j < this.state.nestedListData[i].children.length; j++) {
							millIds.push(AnalyzerQuery.getMillByWriId(this.state.nestedListData[i].children[j].value));
							millLabels.push(this.state.nestedListData[i].children[j].label);
						}
					}
				}
				console.log(millLabels)

				all(millIds).then(function (responses) {
					var ids = [];
          for (var k = 0; k < responses.length; k++) {


						var feature = responses[k];

						// label = target.innerText || target.innerHTML;
						label = millLabels[k];
						console.log(label)

            if ( self.state.activeListItemValues.indexOf(feature.attributes.wri_id) != -1 ) {
              // Remove The Entity Id
              var valueIndex = self.state.activeListItemValues.indexOf(feature.attributes.wri_id);
              newActiveListItemValues = self.state.activeListItemValues.slice(0);
              newActiveListItemValues.splice(valueIndex, 1);
              self.setState( { activeListItemValues: newActiveListItemValues } );
              // Id to remove
              removeId = feature.attributes.OBJECTID;
              // Remove selected feature from features array
              arrayUtils.forEach(selectedFeatures, function (graphic, index) {
                if (removeId === graphic.attributes.OBJECTID) { removeIndex = index; }
              });
              selectedFeatures.splice(removeIndex, 1);
              // Remove the feature from the map
							arrayUtils.some(wizardGraphicsLayer.graphics, function (graphic) {
                if (graphic.attributes.OBJECTID === removeId) {
                  wizardGraphicsLayer.remove(graphic);
                  return true;
                }
                return false;
              });
							arrayUtils.some(wizardPointGraphicsLayer.graphics, function (graphic) {
                if (graphic.attributes.OBJECTID === removeId) {
                  wizardPointGraphicsLayer.remove(graphic);
                  return true;
                }
                return false;
              });
            } else {
              // Add it to the map and make it the current selection, give it a label
							ids.push(feature.attributes.wri_id);
              feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;

							var pointGraphic = GeoHelper.generatePointGraphicFromGeometric(feature.attributes.longitude, feature.attributes.latitude, feature.attributes);
              graphic = GeoHelper.preparePointAsPolygon(feature);
              graphic = GeoHelper.applySelectionSymbolToFeature(graphic);
              wizardGraphicsLayer.add(graphic);
							wizardPointGraphicsLayer.add(pointGraphic);

              selectedFeatures.push(graphic);
            }

					}

					// Add Active Class, Add to array or features, and add label to array of labels
					newActiveListItemValues = self.state.activeListItemValues.concat(ids);
					self.setState({ activeListItemValues: newActiveListItemValues });

					// Mark this as your current selection and provide label
					if (selectedFeatures.length > 0) {
						WizardStore.set(KEYS.selectedCustomFeatures, selectedFeatures);
					} else {
						// This resets the current selection to none
						WizardStore.set(KEYS.selectedCustomFeatures, []);
					}

        });

      } else if (wriId) {

        if (wizardGraphicsLayer) {
	  // AnalyzerQuery.getMillByEntityId(wriId).then(function (feature) {
          AnalyzerQuery.getMillByWriId(wriId).then(function (feature) {
            // Get Reference to Parent for showing selected or not selected
            label = target.innerText || target.innerHTML;


            if ( self.state.activeListItemValues.indexOf(wriId) != -1 ) {
              // Remove The Entity Id
              var valueIndex = self.state.activeListItemValues.indexOf(wriId);
              newActiveListItemValues = self.state.activeListItemValues.slice(0);
              newActiveListItemValues.splice(valueIndex, 1);
              self.setState( { activeListItemValues: newActiveListItemValues } );
              // Id to remove
              removeId = feature.attributes.OBJECTID;
              // Remove selected feature from features array
              arrayUtils.forEach(selectedFeatures, function (graphic, index) {
                if (removeId === graphic.attributes.OBJECTID) { removeIndex = index; }
              });
              selectedFeatures.splice(removeIndex, 1);
              // Remove the feature from the map
              arrayUtils.some(wizardGraphicsLayer.graphics, function (graphic) {
                if (graphic.attributes.OBJECTID === removeId) {
                  wizardGraphicsLayer.remove(graphic);
                  return true;
                }
                return false;
              });
							arrayUtils.some(wizardPointGraphicsLayer.graphics, function (graphic) {
                if (graphic.attributes.OBJECTID === removeId) {
                  wizardPointGraphicsLayer.remove(graphic);
                  return true;
                }
                return false;
              });

            } else {
              // Add it to the map and make it the current selection, give it a label
              feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;
							var pointGraphic = GeoHelper.generatePointGraphicFromGeometric(feature.attributes.longitude, feature.attributes.latitude, feature.attributes);
              graphic = GeoHelper.preparePointAsPolygon(feature);
              graphic = GeoHelper.applySelectionSymbolToFeature(graphic);
              wizardGraphicsLayer.add(graphic);
							wizardPointGraphicsLayer.add(pointGraphic);
              // Add Active Class, Add to array or features, and add label to array of labels
              newActiveListItemValues = self.state.activeListItemValues.concat([wriId]);
              self.setState({ activeListItemValues: newActiveListItemValues });

              selectedFeatures.push(graphic);
            }

            // Mark this as your current selection and provide label
            if (selectedFeatures.length > 0) {
              WizardStore.set(KEYS.selectedCustomFeatures, selectedFeatures);
            } else {
              // This resets the current selection to none
              WizardStore.set(KEYS.selectedCustomFeatures, []);
            }

          });
        }
      }

    },

    _localReset: function () {
      // Call this to reset the selection list and graphics layer
      var wizLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
			var wizLayerPoints = app.map.getLayer(MapConfig.wizardPointGraphicsLayer.id);
      WizardStore.set(KEYS.selectedCustomFeatures, []);
      wizLayer.clear();
			wizLayerPoints.clear();

      this.setState({ activeListItemValues: [] });
    }

  });

});
