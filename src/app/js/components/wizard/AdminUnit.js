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
  "esri/graphicsUtils",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol"
], function (React, MapConfig, MapModel, AnalyzerQuery, AnalyzerConfig, NestedList, topic, Color, Graphic, graphicsUtils, SimpleFillSymbol, SimpleLineSymbol) {

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

      // If the area is this one, the current step is this one
      // and the previous step is 0, then we should update the layer defs to match this UI

      if (newProps.selectedArea === 'adminUnitOption' && 
                    this.props.currentStep === 0 &&
                    newProps.currentStep === 1) {
        
        var value = document.getElementById("country-select").value;
        if (value !== "NONE") {
          topic.publish("setAdminBoundariesDefinition", value);
        }
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
            'placeholder': 'Search administrative units...',
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
      var featureType = target.dataset ? target.dataset.type : target.getAttribute('data-type'),
          objectId = target.dataset ? target.dataset.value : target.getAttribute('data-value'),
          wizardGraphicsLayer,
          self = this,
          graphic;

      if (featureType === "group") {
        // Takes URL and group name, group name will always be the targets innerHTML
        AnalyzerQuery.getFeaturesByGroupName(config.countryBoundaries, target.innerHTML).then(function (features) {
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
        AnalyzerQuery.getFeatureById(config.lowLevelUnitsQuery.url, objectId).then(function (feature) {

          // Add it to the map and make it the current selection, give it a label
          wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
          feature.attributes[AnalyzerConfig.stepTwo.labelField] = target.innerText;
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