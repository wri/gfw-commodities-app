// THIS COMPONENT IS A PIECE NECESSARY FOR STEP TWO

define([
  "react",
  "map/config",
  "analysis/Query",
  "analysis/config",
  "components/wizard/NestedList",
  // Other Helpful Modules
  "dojo/topic",
  "esri/Color",
  "esri/graphic",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol"
], function (React, MapConfig, AnalyzerQuery, AnalyzerConfig, NestedList, topic, Color, Graphic, SimpleFillSymbol, SimpleLineSymbol) {

  var config = AnalyzerConfig.certifiedArea,
      adminSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 2),
                    new Color([255, 200, 103, 0.65]));

  function getDefaultState() {
    return {
      nestedListData: [],
      isLoading: false,
      selectedCommodity: config.commodityOptions[0].value,
      selectedScheme: config.certificationOptions[0].value
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
    },

    render: function () {
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
          React.DOM.p({'className': 'instructions'}, config.instructionsPartThree),
          new NestedList({
            'data': this.state.nestedListData,
            'click': this._schemeClicked,
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
      var objectId = target.dataset.value,
          wizardGraphicsLayer,
          self = this,
          graphic;

      if (objectId) {
        AnalyzerQuery.getFeatureById(config.schemeQuery.url, objectId).then(function (feature) {

          // Add it to the map and make it the current selection, give it a label
          feature.attributes[AnalyzerConfig.stepTwo.labelField] = target.innerHTML;
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