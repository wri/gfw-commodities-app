// THIS COMPONENT IS A PIECE NECESSARY FOR STEP TWO

define([
	"react",
  "map/config",
  "dojo/topic",
  "analysis/Query",
  "analysis/config",
  "esri/units",
  "esri/Color",
  "esri/graphic",
  "esri/geometry/Circle",
  "components/wizard/NestedList",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol"
], function (React, MapConfig, topic, AnalyzerQuery, AnalyzerConfig, Units, Color, Graphic, Circle, NestedList, SimpleLineSymbol, SimpleFillSymbol) {

  var config = AnalyzerConfig.millPoints,
      getDefaultState = function () {
        return ({
          nestedListData: [],
          selectedCommodity: config.commodityOptions[0].value
        });
      },
      circleSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                     new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 2),
                     new Color([255, 200, 103, 0.65]));

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
        
        topic.publish('showMillPoints');
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
          graphic,
          longitude,
          latitude;

      if (featureType === "group") {
        // Mills dont support group selection

      } else if (entityId) {
        AnalyzerQuery.getMillByEntityId(entityId).then(function (feature) {
          // Add it to the map and make it the current selection, give it a label
          feature.attributes[AnalyzerConfig.stepTwo.labelField] = target.innerText || target.innerHTML;
          longitude = feature.attributes.Longitude;
          latitude = feature.attributes.Latitude;
          circle = new Circle([longitude, latitude], {
            "radius": 50,
            "radiusUnit": Units.KILOMETERS
          });
          graphic = new Graphic(circle, circleSymbol, feature.attributes);
          wizardGraphicsLayer = app.map.getLayer(MapConfig.wizardGraphicsLayer.id);
          if (wizardGraphicsLayer) {
            // Clear out any previous 'preview' features
            wizardGraphicsLayer.clear();
            wizardGraphicsLayer.add(graphic);
            // Mark this as your current selection
            self.props.callback.updateAnalysisArea(graphic);
            // Zoom to extent of new feature
            app.map.centerAndZoom([longitude, latitude], 9);
          }

        });
      }
    }

  });

});