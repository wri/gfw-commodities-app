define([
	"react",
  "map/config",
  "dojo/topic",
  "dojo/query",
  "dojo/dom-class",
  "dojo/_base/array",
  "analysis/Query",
  "analysis/config",
  "utils/GeoHelper",
  "analysis/WizardStore",
  "components/wizard/NestedList"
], function (React, MapConfig, topic, dojoQuery, domClass, arrayUtils, AnalyzerQuery, AnalyzerConfig, GeoHelper, WizardStore, NestedList) {

  var config = AnalyzerConfig.millPoints,
      selectedFeatures = [],
      selectedLabels = [];

  var KEYS = AnalyzerConfig.STORE_KEYS;
  var previousStep;

  var getDefaultState = function () {
    return ({
      nestedListData: [],
      activeListItemValues: [],
      selectedCommodity: config.commodityOptions[0].value
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

      if (selectedAreaOfInterest === 'millPointOption' && previousStep === 1 && currentStep === 2) {
        // If Mill Points is not visible show it and select it in the UI, otherwise do nothing
        var layer = app.map.getLayer(MapConfig.mill.id);
        if (layer) {
          if (!layer.visible) {
            topic.publish('showMillPoints');
            topic.publish('toggleItemInLayerList','mill');
          }
        }

        // If this component is appearing in the UI, reset some things and load data if its not available
        // Remove al active classes, set selected features and labels back to default
        selectedFeatures = [];
        selectedLabels = [];

        this.setState({ activeListItemValues: [] });
      }

      previousStep = WizardStore.get(KEYS.userStep);
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
      }
    },

    _selectMapper: function (item) {
      return React.DOM.option({'value': item.value}, item.label);
    },

    render: function () {
      return (
        React.DOM.div({'className': 'mill-point', 'id': 'mill-point'},
          React.DOM.p({'className': 'instructions'}, config.instructions),
          React.DOM.div({'className': 'select-container'},
            React.DOM.select({
              'id': 'mill-select',
              'className': 'mill-select',
              'value': this.state.selectedCommodity,
              'onChange': this._loadMillPoints,
            }, config.commodityOptions.map(this._selectMapper, this))
          ),
          React.DOM.p({'className': 'instructions' + (this.state.nestedListData.length > 0 ? '' : ' hidden')}, config.instructionsPartTwo),
          new NestedList({
            'data': this.state.nestedListData,
            'click': this._millPointSelected,
            'placeholder': 'Search mill points...',
            'activeListItemValues': this.state.activeListItemValues,
            'isResetting': this.props.isResetting
          })
        )
      );
    },

    _loadMillPoints: function () {

      var self = this;

       this.setState({
        isLoading: true
      });

      // Show the features on the map
      // topic.publish('setCommercialEntityDefinition', value);
      AnalyzerQuery.getMillPointData().then(function (data) {
        if (data) {
          self.setState({
            nestedListData: data,
            isLoading: false
          });
        }
      });
      
    },

    _millPointSelected: function (target) {
      var featureType = target.dataset ? target.dataset.type : target.getAttribute('data-type'),
          entityId = target.dataset ? target.dataset.value : target.getAttribute('data-value'),
          wizardGraphicsLayer,
          self = this,
          parentNode,
          removeIndex,
          removeId,
          longitude,
          latitude,
          graphic,
          label;

      if (featureType === "group") {
        // Mills dont support group selection

      } else if (entityId) {

        wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
        if (wizardGraphicsLayer) {
          AnalyzerQuery.getMillByEntityId(entityId).then(function (feature) {
            // Get Reference to Parent for showing selected or not selected
            parentNode = target.parentNode;
            label = target.innerText || target.innerHTML;


            if ( self.state.activeListItemValues.indexOf(entityId) != -1 ) {
            // if (domClass.contains(parentNode, 'active-mill')) {
              var valueIndex = self.state.activeListItemValues.indexOf(entityId);
              var newActiveListItemValues = self.state.activeListItemValues.slice(0);
              newActiveListItemValues.splice(valueIndex, 1);
              self.setState( { activeListItemValues: newActiveListItemValues } );
              // domClass.remove(parentNode, 'active-mill');
              // Id to remove
              removeId = feature.attributes.OBJECTID;
              // Remove selected label from labels array
              removeIndex = arrayUtils.indexOf(selectedLabels, label);
              selectedLabels.splice(removeIndex, 1);              
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
            } else {
              // Add it to the map and make it the current selection, give it a label
              feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;
              graphic = GeoHelper.preparePointAsPolygon(feature);
              wizardGraphicsLayer.add(graphic);
              // Add Active Class, Add to array or features, and add label to array of labels
              var newActiveListItemValues = self.state.activeListItemValues.concat([entityId]);
              self.setState({ activeListItemValues: newActiveListItemValues });
              // domClass.add(parentNode, 'active-mill');
              selectedFeatures.push(graphic);
              selectedLabels.push(label);

              // Zoom to extent of new feature
              app.map.centerAndZoom([graphic.attributes.Longitude, graphic.attributes.Latitude], 9);
            }

            // Mark this as your current selection and provide label
            if (selectedFeatures.length > 0) {
              WizardStore.set(KEYS.selectedCustomFeatureAlias, selectedLabels.join(', '));
              WizardStore.set(KEYS.selectedCustomFeatures, selectedFeatures);
            } else {
              // This resets the current selection to none
              WizardStore.set(KEYS.selectedCustomFeatures);
            }

          });
        }
      }
      
    }

  });

});