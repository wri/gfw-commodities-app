/** @jsx React.DOM */
define([
  "react",
  "map/config",
  "map/Symbols",
  "analysis/Query",
  "analysis/config",
  "utils/GeoHelper",
  "analysis/WizardStore",
  "actions/WizardActions",
  "components/wizard/NestedList",
  // Other Helpful Modules
  "dojo/topic",
  "dojo/query",
  "esri/graphic"
], function (React, MapConfig, Symbols, AnalyzerQuery, AnalyzerConfig, GeoHelper, WizardStore, WizardActions, NestedList, topic, query, Graphic) {

  var config = AnalyzerConfig.certifiedArea;
  var KEYS = AnalyzerConfig.STORE_KEYS;
  var previousFeatureType; // Track what kind of feature they are currently selecting
  var previousStep;

  function getDefaultState() {
    return {
      nestedListData: [],
      activeListItemValues: [],
      activeListGroupValue: null,
      isLoading: false,
      selectedCommodity: config.commodityOptions[0].value,
      selectedScheme: config.certificationOptions[1].value
    };
  }

  return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      // Register callbacks
      WizardStore.registerCallback(KEYS.userStep, this.userChangedSteps);
      previousStep = WizardStore.get(KEYS.userStep);
    },

    shouldComponentUpdate: function () {
      return WizardStore.get(KEYS.userStep) === 2 && WizardStore.get(KEYS.areaOfInterest) === AnalyzerConfig.stepOne.option4.id;
    },

    userChangedSteps: function () {
      var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
      var currentStep = WizardStore.get(KEYS.userStep);

      // If the user is arriving at this step and has chosen a type and scheme
      if (selectedAreaOfInterest === 'certifiedAreaOption' && 
          this.state.selectedScheme !== 'NONE' && 
          currentStep === 2 && previousStep === 1) {
        
        topic.publish('setCertificationSchemeDefinition', this.state.selectedScheme);

        // If no data has been loaded, do so now that this view is presented to the user
        if (this.state.nestedListData.length === 0) {
          var mockEvt = {
            target: {
              value: config.certificationOptions[1].value
            }
          };
          
          this._loadFeatures(mockEvt);
        }

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

      // Hide legend content pane
      var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
      var currentStep = WizardStore.get(KEYS.userStep);

      if (currentStep === 2 && selectedAreaOfInterest === 'certifiedAreaOption') {

        switch (this.state.selectedCommodity) {
          case 'Oil palm concession':
            topic.publish('filterConcessionsLegendItems',2);
            break;
        }

        if (this.state.selectedCommodity === 'NONE') {
          topic.publish('hideConcessionsLegend');
        } else {
          topic.publish('showConcessionsLegend');
        }

      }

      return (
        React.createElement("div", {className: "certified-area"}, 
          React.createElement("p", {className: "instructions"}, " ", config.instructions, " "), 
          React.createElement("select", {className: "commodity-type-select", value: this.state.selectedCommodity, onChange: this._updateCommodity}, 
            config.commodityOptions.map(this._selectMapper, this)
          ), 
          React.createElement("p", {className: "instructions"}, " ", config.instructionsPartTwo, " "), 
          React.createElement("select", {className: "certification-scheme-select", value: this.state.selectedScheme, onChange: this._loadFeatures}, 
            config.certificationOptions.map(this._selectMapper, this)
          ), 
          React.createElement("span", {className: 'loading-wheel' + (this.state.isLoading ? '': ' hidden')}), 
          React.createElement("p", {className: 'instructions' + (this.state.nestedListData.length > 0 ? '' : ' hidden')}, config.instructionsPartThree), 
          React.createElement(NestedList, {
            data: this.state.nestedListData, 
            click: this._schemeClicked, 
            placeholder: "Search certified areas...", 
            activeListItemValues: this.state.activeListItemValues, 
            activeListGroupValue: this.state.activeListGroupValue, 
            isResetting: this.props.isResetting}
          )
        )
      );
    },

    _selectMapper: function (item) {
      return React.createElement("option", {value: item.value}, item.label);
    },
    /* jshint ignore:end */

    _updateCommodity: function (evt) {
      this.setState({ selectedCommodity: evt.target.value });
    },

    _updateScheme: function (value) {
      // Update the isLoading because when this is updated, we are performing a query
      this.setState({
        selectedScheme: value,
        isLoading: true
      });
    },

    _loadFeatures: function (evt) {
      var value = evt.target.value,
          self = this;

      if (value === "NONE") {
        // Hide the Layer and clear the list
        topic.publish("setCertificationSchemeDefinition");
        this.setState({
          nestedListData: [],
          selectedScheme: value
        });
        return;
      }

      // Update scheme in state and isLoading
      this._updateScheme(value);

      // Show the features on the map
      topic.publish('setCertificationSchemeDefinition', value);

      AnalyzerQuery.getFeaturesByScheme(value, this.state.selectedCommodity).then(function (data) {
        self.setState({
          nestedListData: data,
          isLoading: false
        });
      });
    },

    _schemeClicked: function (target) {
      var wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id),
          objectId = parseInt(target.getAttribute('data-value')),
          featureType = target.getAttribute('data-type'),
          label = target.innerText || target.innerHTML,
          activeItems,
          self = this,
          graphic;

      // They cant select features and groups right now
      // so if they swicth, clear the selection list and the layer
      if (featureType !== previousFeatureType) {
        WizardActions.clearSelectedCustomFeatures();
        wizardGraphicsLayer.clear();
      }
      
      // Update this for bookkeeping
      previousFeatureType = featureType;

      if (featureType === "group") {
    
        activeItems = this.state.activeListGroupValue; // Single Id
        // Same group, deselect it by removing it from store, map, and list
        if (activeItems === objectId) {
          WizardActions.removeSelectedFeatureByField(config.groupQuery.requiredField, label);
          GeoHelper.removeGraphicByField(MapConfig.wizardGraphicsLayer.id, config.groupQuery.requiredField, label);

          self.setState({
            activeListGroupValue: undefined
          });
        } else {
          // Clear Previous Features
          WizardActions.clearSelectedCustomFeatures();
          // Update state
          self.setState({
            activeListItemValues: [],
            activeListGroupValue: objectId
          });
          // Clear the layer
          wizardGraphicsLayer.clear();

          // Takes URL and group name, group name will always be the targets innerHTML
          AnalyzerQuery.getFeaturesByGroupName(config.groupQuery, label).then(function (features) {
            wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
            if (features && wizardGraphicsLayer) {
              features.forEach(function (feature) {
                // Add it to the map and make it the current selection, give it a label
                feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;
                graphic = new Graphic(feature.geometry, Symbols.getHighlightPolygonSymbol(), feature.attributes);
                wizardGraphicsLayer.add(graphic);
              });
              WizardActions.addSelectedFeatures(features);
            }
          });
        }

      } else if (objectId) {

        activeItems = this.state.activeListItemValues;
        var indexOfObject = activeItems.indexOf(objectId);

        // This item is already selected, deselect it by removing it from the store, map, and list
        if (indexOfObject > -1) {
          activeItems.splice(indexOfObject, 1);
          WizardActions.removeSelectedFeatureByField('OBJECTID', objectId);
          GeoHelper.removeGraphicByField(MapConfig.wizardGraphicsLayer.id, 'OBJECTID', objectId);

          self.setState({
            activeListItemValues: activeItems,
            activeListGroupValue: undefined
          });
        } else {

          activeItems.push(objectId);

          self.setState({
            activeListItemValues: activeItems,
            activeListGroupValue: null
          });

          AnalyzerQuery.getFeatureById(config.schemeQuery.url, objectId).then(function (feature) {
            // Add it to the map and make it the current selection, give it a label
            feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;
            graphic = new Graphic(feature.geometry, Symbols.getHighlightPolygonSymbol(), feature.attributes);
            WizardActions.addSelectedFeatures([graphic]);

            wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
            if (wizardGraphicsLayer) {
              wizardGraphicsLayer.add(graphic);
            }
          });

        } // End else

      }// End else if

    }// End _schemeClicked

  });

});
