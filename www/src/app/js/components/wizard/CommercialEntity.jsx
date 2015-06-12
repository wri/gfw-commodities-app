/** @jsx React.DOM */
define([
	"react",
  "map/config",
  "map/Symbols",
  "analysis/Query",
  "analysis/config",
  "utils/GeoHelper",
  "analysis/WizardStore",
  "analysis/WizardActions",
  "components/wizard/NestedList",
  // Other Useful Modules
  "dojo/topic",
  "dojo/query",
  "esri/graphic"
], function (React, MapConfig, Symbols, AnalyzerQuery, AnalyzerConfig, GeoHelper, WizardStore, WizardActions, NestedList, topic, query, Graphic) {

  var config = AnalyzerConfig.commercialEntity;
  var KEYS = AnalyzerConfig.STORE_KEYS;
  var previousStep;
  var previousFeatureType;

  function getDefaultState() {
    return {
      nestedListData: [],
      activeListItemValues: [],
      activeListGroupValue: undefined,
      isLoading: false,
      selectedCommodity: config.commodityOptions[0].value
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
      return WizardStore.get(KEYS.userStep) === 2 && WizardStore.get(KEYS.areaOfInterest) === AnalyzerConfig.stepOne.option3.id;
    },

    userChangedSteps: function () {
      var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
      var currentStep = WizardStore.get(KEYS.userStep);
      // If the user is arriving at this step and has selected a commoditity type
      if (selectedAreaOfInterest === 'commercialEntityOption' && 
          this.state.selectedCommodity !== 'NONE' &&
          previousStep === 1 && currentStep === 2) {

        topic.publish('setCommercialEntityDefinition', this.state.selectedCommodity);
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

      var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
      var currentStep = WizardStore.get(KEYS.userStep);

      // Filter legend content pane or hide
      if (currentStep === 2 && selectedAreaOfInterest === 'commercialEntityOption') {

        switch (this.state.selectedCommodity) {
          case 'Logging concession':
            topic.publish('filterConcessionsLegendItems',0);
            break;
          case 'Mining concession':
            topic.publish('filterConcessionsLegendItems',1);
            break;
          case 'Oil palm concession':
            topic.publish('filterConcessionsLegendItems',2);
            break;
          case 'Wood fiber plantation':
            topic.publish('filterConcessionsLegendItems',3);
            break;
        }

        if (this.state.selectedCommodity === 'NONE') {
          topic.publish('hideConcessionsLegend');
        } else {
          topic.publish('showConcessionsLegend');
        }

      }

      return (
        <div className='commercial-entity'>
          <p className='instructions'> {config.instructions} </p>
          <select className='commodity-type-select' value={this.state.selectedCommodity} onChange={this._loadFeatures}>
            {config.commodityOptions.map(this._selectMapper, this)}
          </select>
          <span className={'loading' + (this.state.isLoading ? '' : ' hidden')} />
          <p className={'instructions' + (this.state.nestedListData.length> 0 ? '' : ' hidden')}>
            {config.instructionsPartTwo}
          </p>
          <NestedList
            data={this.state.nestedListData}
            click={this._commodityClicked}
            placeholder='Search commercial entities'
            activeListItemValues={this.state.activeListItemValues}
            activeListGroupValue={this.state.activeListGroupValue}
            isResetting={this.props.isResetting}
          />
        </div>
      );
    },

    _selectMapper: function (item) {
      return <option value={item.value}>{item.label}</option>;
    },
    /* jshint ignore:end */

    _loadFeatures: function (evt) {
      var value = evt.target.value,
          self = this;

      if (value === "NONE") {
        // Hide the Layer and clear the list
        topic.publish("setCommercialEntityDefinition");
        this.setState({
          nestedListData: [],
          selectedCommodity: value
        });
        return;
      } 

      this.setState({
        selectedCommodity: value,
        isLoading: true
      });

      // Show the features on the map
      topic.publish('setCommercialEntityDefinition', value);
      AnalyzerQuery.getFeaturesByCommodity(value).then(function (data) {
        self.setState({
          nestedListData: data,
          isLoading: false
        });
      });
    },

    _commodityClicked: function (target) {
      var wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id),
          objectId = parseInt(target.getAttribute('data-value')),
          featureType = target.getAttribute('data-type'),
          selectedFeatures = WizardStore.get(KEYS.selectedCustomFeatures),
          label = target.innerText || target.innerHTML,
          self = this,
          graphic;

      // They cant select features and groups right now
      // so if they swicth, clear the selection list and the layer
      if (previousFeatureType !== featureType) {
        WizardActions.clearSelectedCustomFeatures();
        wizardGraphicsLayer.clear();
      }

      // Update this for bookkeeping purposes
      previousFeatureType = featureType;

      if (featureType === "group") {
        // Do nothing for group with no name since its not an actual group
        if (label === AnalyzerConfig.noNameField) {
          return;
        }

        var activeGroupId = this.state.activeListGroupValue;

        // If the same group is clicked, clear the list, selectedFeatures, and Map Graphics
        if (objectId === activeGroupId) {
          // The name is the inner HTML, the field is the field used for the query
          WizardActions.removeSelectedFeatureByField(config.groupQuery.requiredField, label);
          GeoHelper.removeGraphicByField(MapConfig.wizardGraphicsLayer.id, config.groupQuery.requiredField, label);

          self.setState({
            activeListGroupValue: undefined
          });

        } else {
          // Clear Previous Features
          WizardActions.clearSelectedCustomFeatures();
          // Set the active group id and make sure individual features are not selected
          self.setState({
            activeListItemValues: [],
            activeListGroupValue: objectId
          });
          // Clear the layer
          wizardGraphicsLayer.clear();

          AnalyzerQuery.getFeaturesByGroupName(config.groupQuery, label).then(function (features) {
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

        var activeListIds = this.state.activeListItemValues;
        var indexOfObject = activeListIds.indexOf(objectId);

        // If the id already exists, then we should remove it
        if (indexOfObject > -1) {
          // Remove from list, selectedFeatures, and map
          activeListIds.splice(indexOfObject, 1);
          WizardActions.removeSelectedFeatureByField('OBJECTID', objectId);
          GeoHelper.removeGraphicByField(MapConfig.wizardGraphicsLayer.id, 'OBJECTID', objectId);

          self.setState({
            activeListItemValues: activeListIds,
            activeListGroupValue: undefined
          });
        } else {
          // Item not yet selected, so add the ID to the selected list
          activeListIds.push(objectId);

          // Update the state
          self.setState({
            activeListItemValues: activeListIds,
            activeListGroupValue: undefined
          });

          // Get the graphic and add it to the selected features list
          AnalyzerQuery.getFeatureById(config.commodityQuery.url, objectId).then(function (feature) {
            // Add it to the map and make it the current selection
            feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;
            graphic = new Graphic(feature.geometry, Symbols.getHighlightPolygonSymbol(), feature.attributes);
            WizardActions.addSelectedFeatures([graphic]);

            // Add the graphic to the map
            if (wizardGraphicsLayer) {
              wizardGraphicsLayer.add(graphic);
            }

          });
        } // End else

      } // End else if

    }// End __commodityClicked

  });

});
