// THIS COMPONENT IS A PIECE NECESSARY FOR STEP TWO

define([
	"react",
  "map/config",
  "analysis/Query",
  "analysis/config",
  "components/wizard/NestedList",
  // Other Useful Modules
  "dojo/topic",
  "dojo/query",
  "esri/Color",
  "esri/graphic",
  "esri/graphicsUtils",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol"
], function (React, MapConfig, AnalyzerQuery, AnalyzerConfig, NestedList, topic, query, Color, Graphic, graphicsUtils, SimpleFillSymbol, SimpleLineSymbol) {

  var config = AnalyzerConfig.commercialEntity,
      adminSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2),
                    new Color([255, 200, 103, 0.0]));

  function getDefaultState() {
    return {
      nestedListData: [],
      activeListItemValues: [],
      activeListGroupValue: null,
      isLoading: false,
      selectedCommodity: config.commodityOptions[0].value
    };
  }

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
      }

      // If the area is this one, we have a selected commodity, the current step is this one
      // and the previous step is 0, then we should update the layer defs to match this UI

      if (newProps.selectedArea === 'commercialEntityOption' && 
                     this.state.selectedCommodity !== 'NONE' &&
                     this.props.currentStep === 1 &&
                     newProps.currentStep === 2) {
        
        topic.publish('setCommercialEntityDefinition', this.state.selectedCommodity);

      }
    },

    render: function () {

      // Filter legend content pane or hide
      if (this.props.currentStep === 2 && this.props.selectedArea === 'commercialEntityOption') {

        switch (this.state.selectedCommodity) {
          case 'Logging concession':
            topic.publish('filterLegendContentPaneItems',0);
            break;
          case 'Mining concession':
            topic.publish('filterLegendContentPaneItems',1);
            break;
          case 'Oil palm concession':
            topic.publish('filterLegendContentPaneItems',2);
            break;
          case 'Wood fiber plantation':
            topic.publish('filterLegendContentPaneItems',3);
            break;
        }

        if (this.state.selectedCommodity === 'NONE') {
          topic.publish('hideLegendContentPane');
        } else {
          topic.publish('showLegendContentPane');
        }

      }

      return (
        React.DOM.div({'className': 'commercial-entity'},
          React.DOM.p({'className': 'instructions'}, config.instructions),
          React.DOM.select({
              'className': 'commodity-type-select',
              'value': this.state.selectedCommodity,
              'onChange': this._loadFeatures
            },
            config.commodityOptions.map(this._selectMapper, this)
          ),
          React.DOM.span({'className': 'loading-wheel ' + (this.state.isLoading ? '' : 'hidden')}),
          React.DOM.p({'className': 'instructions' + (this.state.nestedListData.length > 0 ? '' : ' hidden')}, config.instructionsPartTwo),
          new NestedList({
            'data': this.state.nestedListData,
            'click': this._commodityClicked,
            'placeholder': 'Search commercial entities...',
            'activeListItemValues': this.state.activeListItemValues,
            'activeListGroupValue': this.state.activeListGroupValue,
            'isResetting': this.props.isResetting
          })
        )
      );
    },

    _selectMapper: function (item) {
      return React.DOM.option({'value': item.value}, item.label);
    },

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
      var featureType = target.dataset ? target.dataset.type : target.getAttribute('data-type'),
          objectId = target.dataset ? target.dataset.value : target.getAttribute('data-value'),
          wizardGraphicsLayer,
          self = this,
          graphic;

      if (featureType === "group") {

        if (target.innerHTML === AnalyzerConfig.noNameField) {
          return;
        }

        var newActiveListeItemValues = []; 
        query('.wizard-list-child-item span', target.parentNode).forEach(function(element){
          newActiveListeItemValues.push(parseInt(element.dataset ? element.dataset.value : element.getAttribute('data-value')));
        });
      
        self.setState({
          activeListItemValues: newActiveListeItemValues,
          activeListGroupValue: parseInt(objectId)
        });

        // Takes URL and group name, group name will always be the targets innerHTML
        AnalyzerQuery.getFeaturesByGroupName(config.groupQuery, target.innerHTML).then(function (features) {
          wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);

          if (features && wizardGraphicsLayer) {
            wizardGraphicsLayer.clear();
            features.forEach(function (feature) {
              // Add it to the map and make it the current selection, give it a label
              feature.attributes[AnalyzerConfig.stepTwo.labelField] = target.innerText;
              graphic = new Graphic(feature.geometry, adminSymbol, feature.attributes);
              wizardGraphicsLayer.add(graphic);              
            });
            // Mark this as your current selection and pass in an optional label since analysis area
            // is an array of graphics instead of a single graphic
            self.props.callback.updateAnalysisArea(features, target.innerHTML);
            app.map.setExtent(graphicsUtils.graphicsExtent(features), true);
          }
        });
      } else if (objectId) {

        self.setState({
          activeListItemValues: [parseInt(objectId)],
          activeListGroupValue: null
        });

        AnalyzerQuery.getFeatureById(config.commodityQuery.url, objectId).then(function (feature) {

          // Add it to the map and make it the current selection, give it a label
          feature.attributes[AnalyzerConfig.stepTwo.labelField] = target.innerHTML || target.innerText;
          graphic = new Graphic(feature.geometry, adminSymbol, feature.attributes);
          wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
          if (wizardGraphicsLayer) {
            // Clear out any previous 'preview' features
            wizardGraphicsLayer.clear();
            wizardGraphicsLayer.add(graphic);
            // Mark this as your current selection
            self.props.callback.updateAnalysisArea(graphic);
            // Zoom to extent of new feature
            if (graphic._extent) {
              app.map.setExtent(graphic._extent, true);
            } else {
              app.map.setExtent(graphic.getExtent(), true);
            }
          }

        });
      }
    }

  });

});