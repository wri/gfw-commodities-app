// THIS COMPONENT IS A PIECE NECESSARY FOR STEP TWO
define([
	"react",
  "map/config",
  "map/MapModel",
  "analysis/Query",
  "analysis/config",
  "components/wizard/NestedList",
  // Other Helpful Modules
  "dojo/topic",
  "esri/Color",
  "esri/graphic",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol"
], function (React, MapConfig, MapModel, AnalyzerQuery, AnalyzerConfig, NestedList, topic, Color, Graphic, SimpleFillSymbol, SimpleLineSymbol) {

  var config = AnalyzerConfig.adminUnit,
      adminSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 2),
                    new Color([255, 200, 103, 0.65]));

  function getDefaultState() {
    return {
      nestedListData: [],
      isLoading: false
    };
  }

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      MapModel.applyTo('admin-unit');
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
        document.getElementById('country-select').value = "NONE";
      }
    },

    render: function () {
      return (
        React.DOM.div({'className': 'admin-unit', 'id': 'admin-unit'}, 
          React.DOM.p({'className': 'instructions'}, config.instructions),
          React.DOM.div({'className': 'select-container'},
            React.DOM.select({
              'id': 'country-select',
              'className': 'country-select', 
              'onChange': this._loadAdminUnits,
              'data-bind': "options: allCountries, optionsText: 'label', optionsValue: 'value'"
            }),
            React.DOM.span({'className': 'loading-wheel ' + (this.state.isLoading ? '' : 'hidden')})
          ),
          React.DOM.p({'className': 'instructions'}, config.instructionsPartTwo),
          new NestedList({
            'data': this.state.nestedListData,
            'click': this._lowLevelAdminUnitClick,
            'isResetting': this.props.isResetting
          })
        )
      );
    },

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
      var objectId = target.dataset.value,
          wizardGraphicsLayer,
          self = this,
          graphic;

      if (objectId) {
        AnalyzerQuery.getFeatureById(config.lowLevelUnitsQuery.url, objectId).then(function (feature) {

          // Add it to the map and make it the current selection, give it a label
          wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
          feature.attributes[AnalyzerConfig.stepTwo.labelField] = target.innerHTML;
          graphic = new Graphic(feature.geometry, adminSymbol, feature.attributes);
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
    },

    _countrySelectMapper: function (item) {
      return React.DOM.option({'value': item.value}, item.label);
    }

  });

});