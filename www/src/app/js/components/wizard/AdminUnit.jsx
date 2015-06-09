/** @jsx React.DOM */
define([
	"react",
  "map/config",
  "map/Symbols",
  "map/MapModel",
  "analysis/Query",
  "analysis/config",
  "utils/GeoHelper",
  "analysis/WizardStore",
  "analysis/WizardActions",
  "components/wizard/NestedList",
  // Other Helpful Modules
  "dojo/topic",
  "dojo/query",
  "esri/graphic",
], function (React, MapConfig, Symbols ,MapModel, AnalyzerQuery, AnalyzerConfig, GeoHelper, WizardStore, WizardActions, NestedList, topic, query, Graphic) {

  var config = AnalyzerConfig.adminUnit;
  var KEYS = AnalyzerConfig.STORE_KEYS;
  var previousStep;
  var previousFeatureType;

  function getDefaultState() {
    return {
      nestedListData: [],
      activeListItemValues: [],
      activeListGroupValue: null,
      isLoading: false
    };
  }

	var AdminUnit = React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      MapModel.applyTo('admin-unit');
      // Register callbacks
      WizardStore.registerCallback(KEYS.userStep, this.userChangedSteps);
      previousStep = WizardStore.get(KEYS.userStep);
    },

    shouldComponentUpdate: function () {
      return WizardStore.get(KEYS.userStep) === 2 && WizardStore.get(KEYS.areaOfInterest) === AnalyzerConfig.stepOne.option2.id;
    },

    userChangedSteps: function () {
      // If the user is arriving at this step, set up some layer defs to support this component
      var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
      var currentStep = WizardStore.get(KEYS.userStep);

      if (selectedAreaOfInterest === 'adminUnitOption' && currentStep === 2) {
        var value = document.getElementById("country-select").value;
        if (value !== "NONE" && previousStep === 1) {
          topic.publish("setAdminBoundariesDefinition", value);
        }
      }

      previousStep = WizardStore.get(KEYS.userStep);

    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
        document.getElementById('country-select').value = "NONE";
      }
    },

    /* jshint ignore:start */
    render: function () {
      return (
        <div className='admin-unit' id='admin-unit'>
          <p className='instructions'> {config.instructions} </p>
          <div className='select-container'>
            <select
              id='country-select'
              className='country-select'
              onChange={this._loadAdminUnits}
              data-bind='options: allCountries, optionsText: "label", optionsValue: "value"'
            />
            <span className={'loading-wheel' + (this.state.isLoading ? '' : ' hidden')} />
          </div>
          <p className={'instructions' + (this.state.nestedListData.length > 0) ? '' : ' hidden'}>
            {config.instructionsPartTwo}
          </p>
          <NestedList
            data={this.state.nestedListData}
            click={this._lowLevelAdminUnitClick}
            placeholder='Search administrative units...'
            activeListItemValues={this.state.activeListItemValues}
            activeListGroupValue={this.state.activeListGroupValue}
            isResetting={this.props.isResetting}
          />
        </div>
      );
    },

    /* jshint ignore:end */

    _loadAdminUnits: function (evt) {
      var value = evt.target.value,
          self = this;

      if (value === "NONE") {
        // Hide the Layer and clear the list
        topic.publish("setAdminBoundariesDefinition");
        this.setState({
          nestedListData: []
        });
        return;
      }
      // Update State and publish method to show the layer on the map
      this.setState({
        isLoading: true
      });

      topic.publish("setAdminBoundariesDefinition", value);

      AnalyzerQuery.getLowLevelAdminUnitData(value).then(function (data) {
        self.setState({
          nestedListData: data,
          isLoading: false
        });
      });

    },

    _lowLevelAdminUnitClick: function (target) {
      var objectId = parseInt(target.getAttribute('data-value')),
          featureType = target.getAttribute('data-type'),
          label = target.innerText || target.innerHTML,
          wizardGraphicsLayer,
          activeItems,
          self = this,
          graphic;


      if (featureType !== previousFeatureType) {
        WizardActions.clearSelectedCustomFeatures();
      }
      
      // Update this for bookkeeping
      previousFeatureType = featureType;

      if (featureType === "group") {

        activeItems = this.state.activeListGroupValue;

        if (activeItems === objectId) {
          WizardActions.removeSelectedFeatureByField(config.countryBoundaries.requiredField, label);
          GeoHelper.removeGraphicByField(MapConfig.wizardGraphicsLayer.id, config.countryBoundaries.requiredField, label);

          self.setState({
            activeListGroupValue: undefined
          });
        } else {

          self.setState({
            activeListItemValues: [],
            activeListGroupValue: objectId
          });

          // Takes URL and group name, group name will always be the targets innerHTML
          var countrySelect = document.getElementById('country-select').value;
    
          AnalyzerQuery.getFeaturesByGroupNameAndCountry(config.countryBoundaries, label, countrySelect).then(function (features) {
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

          AnalyzerQuery.getFeatureById(config.lowLevelUnitsQuery.url, objectId).then(function (feature) {

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

      } // End else-if

    } // End Function

  });

  return AdminUnit;

});
