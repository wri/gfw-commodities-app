define([
	"react",
  "map/config",
  "dojo/topic",
  "dojo/dom-class",
  "dojo/_base/array",
  "analysis/Query",
  "analysis/config",
  "utils/GeoHelper",
  "components/wizard/NestedList"
], function (React, MapConfig, topic, domClass, arrayUtils, AnalyzerQuery, AnalyzerConfig, GeoHelper, NestedList) {

  var config = AnalyzerConfig.millPoints,
      selectedFeatures = [],
      selectedLabels = [],
      getDefaultState = function () {
        return ({
          nestedListData: [],
          selectedCommodity: config.commodityOptions[0].value
        });
      };

	return React.createClass({

    getInitialState: function () {
      return ({
        nestedListData: [],
        selectedCommodity: config.commodityOptions[0].value
      });
    },

    componentDidMount: function () {

    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
      }

      // If the area is this one, we have a selected commodity, the current step is this one
      // and the previous step is 0, then we should update the layer defs to match this UI
      if (newProps.selectedArea === 'millPointOption' && 
                     this.props.currentStep === 1 &&
                     newProps.currentStep === 2) {

        // If Mill Points is not visible show it and select it in the UI, otherwise do nothing
        var layer = app.map.getLayer(MapConfig.mill.id);
        if (layer) {
          if (!layer.visible) {
            topic.publish('showMillPoints');
            topic.publish('toggleItemInLayerList','mill');
          }
        }

      }

      if (newProps.selectedArea === 'millPointOption' && newProps.currentStep === 2) {
        if (this.state.nestedListData.length === 0) {
          // Get Data
          this._loadMillPoints();
        }
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
          React.DOM.p({'className': 'instructions'}, config.instructionsPartTwo),
          new NestedList({
            'data': this.state.nestedListData,
            'click': this._millPointSelected,
            'placeholder': 'Search mill points...',
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
      var featureType = target.dataset ? target.dataset.type : target.getAttribute('type'),
          entityId = target.dataset ? target.dataset.value : target.getAttribute('value'),
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

            if (domClass.contains(parentNode, 'active-mill')) {
              domClass.remove(parentNode, 'active-mill');
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
              // Do Not add if they have already selected too many features.
              // Return as well as we dont want to update any state or UI items.
              if (selectedFeatures.length > 4) {
                alert('You have already selected the maximum number of mills, please deselect some if you want to add more.');
                return;
              }
              // Add it to the map and make it the current selection, give it a label
              feature.attributes[AnalyzerConfig.stepTwo.labelField] = label;
              graphic = GeoHelper.preparePointAsPolygon(feature);
              wizardGraphicsLayer.add(graphic);
              // Add Active Class, Add to array or features, and add label to array of labels
              domClass.add(parentNode, 'active-mill');
              selectedFeatures.push(graphic);
              selectedLabels.push(label);

              // Zoom to extent of new feature
              app.map.centerAndZoom([graphic.attributes.Longitude, graphic.attributes.Latitude], 9);
            }

            // Mark this as your current selection and provide label
            if (selectedFeatures.length > 0) {
              self.props.callback.updateAnalysisArea(selectedFeatures, selectedLabels.join(', '));
            } else {
              // This resets the current selection to none
              self.props.callback.updateAnalysisArea(undefined);
            }

          });
        }
      }
      
    }

  });

});