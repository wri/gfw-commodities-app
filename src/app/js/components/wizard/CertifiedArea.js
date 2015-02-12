// THIS COMPONENT IS A PIECE NECESSARY FOR STEP TWO

define([
  "react",
  "map/config",
  "analysis/Query",
  "analysis/config",
  "components/wizard/NestedList",
  // Other Helpful Modules
  "dojo/topic",
  "dojo/query",
  "esri/Color",
  "esri/graphic",
  "esri/graphicsUtils",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol"
], function (React, MapConfig, AnalyzerQuery, AnalyzerConfig, NestedList, topic, query, Color, Graphic, graphicsUtils, SimpleFillSymbol, SimpleLineSymbol) {

  var config = AnalyzerConfig.certifiedArea,
      adminSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2),
                    new Color([255, 200, 103, 0.0]));

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

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
      }

      // If the area is this one, we have a selected scheme, the current step is this one
      // and the previous step is 0, then we should update the layer defs to match this UI

      if (newProps.selectedArea === 'certifiedAreaOption' && 
                     this.state.selectedScheme !== 'NONE' &&
                     this.props.currentStep === 1 &&
                     newProps.currentStep === 2) {
        
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

    },

    render: function () {

      // Hide legend content pane
      if (this.props.currentStep === 2 && this.props.selectedArea === 'certifiedAreaOption') {

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
        React.DOM.div({'className': 'certified-area'},
          React.DOM.p({'className': 'instructions'}, config.instructions),
          React.DOM.select({
              'className': 'commodity-type-select', 
              'value': this.state.selectedCommodity,
              'onChange': this._updateCommodity
            },
            config.commodityOptions.map(this._selectMapper, this)
          ),
          React.DOM.p({'className': 'instructions'}, config.instructionsPartTwo),
          React.DOM.select({
              'className': 'certification-scheme-select',
              'value': this.state.selectedScheme,
              'onChange': this._loadFeatures
            },
            config.certificationOptions.map(this._selectMapper, this)
          ),
          React.DOM.span({'className': 'loading-wheel ' + (this.state.isLoading ? '' : 'hidden')}),
          React.DOM.p({'className': 'instructions' + (this.state.nestedListData.length > 0 ? '' : ' hidden')}, config.instructionsPartThree),
          new NestedList({
            'data': this.state.nestedListData,
            'click': this._schemeClicked,
            'placeholder': 'Search certified areas...',
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

    _updateCommodity: function (evt) {
      this.setState({
        selectedCommodity: evt.target.value
      });
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
      var featureType = target.dataset ? target.dataset.type : target.getAttribute('data-type'),
          objectId = target.dataset ? target.dataset.value : target.getAttribute('data-value'),
          wizardGraphicsLayer,
          self = this,
          graphic;

      if (featureType === "group") {

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
              feature.attributes[AnalyzerConfig.stepTwo.labelField] = target.innerText || target.innerHTML;
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

        AnalyzerQuery.getFeatureById(config.schemeQuery.url, objectId).then(function (feature) {

          // Add it to the map and make it the current selection, give it a label
          feature.attributes[AnalyzerConfig.stepTwo.labelField] = target.innerText || target.innerHTML;
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