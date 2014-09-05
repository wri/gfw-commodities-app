// THIS COMPONENT IS A PIECE NECESSARY FOR STEP TWO

define([
	"react",
  "analysis/config",
  "esri/Color",
  "esri/graphic",
  "esri/toolbars/draw",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "dojo/query",
  "dojo/dom-class",
  "map/config",
  "map/MapModel"
], function (React, AnalyzerConfig, Color, Graphic, Draw, SimpleFillSymbol, SimpleLineSymbol, dojoQuery, domClass, MapConfig, MapModel) {

  var drawingInstructions = AnalyzerConfig.customArea.instructions,
      customFeatureSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 2),
                            new Color([103, 200, 255, 0.65])),
      customFeatures = [],
      graphicsLayer,
      drawToolbar,
      activeTool;

  function getDefaultState() {
    return {
      graphics: customFeatures
    };
  }

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      // Create all the Necessary Drawing Tools Here
      drawToolbar = new Draw(app.map);
      drawToolbar.on('draw-end', this._drawComplete);
      graphicsLayer = app.map.getLayer(MapConfig.customGraphicsLayer.id);

      /* 
        If adding graphics from URL, pull them from URL, add to customFeatures, then setState here like below 
        customFeatures.push(graphic);
        this.setState({
          graphics: customFeatures
        });
      */

    },

    render: function () {
      return (
        React.DOM.div({'className': 'custom-area'},
          React.DOM.p({'className': 'drawing-instructions'}, drawingInstructions),
          React.DOM.div({'className': 'drawing-tools'},
            React.DOM.div({'className': 'drawing-tool-button', onClick: this._activateToolbar }, AnalyzerConfig.customArea.freehandLabel),
            React.DOM.div({'className': 'drawing-tool-button', onClick: this._activateToolbar }, AnalyzerConfig.customArea.polyLabel),
            React.DOM.div({'className': 'drawing-tool-button'}, AnalyzerConfig.customArea.uploadLabel)
          ),
          React.DOM.div({'className': 'custom-graphics-list-container'},
            (this.state.graphics.length > 0 ?
              React.DOM.div({'className': 'clear-custom-features', 'onClick': this._clearFeatures}, "clear all")
              : null
            ),
            this.state.graphics.map(this._mapper, this)
          )
        )
      );
    },

    _mapper: function (item) {
      return React.DOM.div(
        {
          'className': 'custom-feature-row', 
          'onClick': this._chooseGraphic,
          'data-feature-id': item.attributes.WRI_ID
        },
        item.attributes.label);
    },

    _chooseGraphic: function (evt) {
      var id = evt.target.dataset ? evt.target.dataset.featureId : evt.target.getAttribute("data-feature-id"),
          self = this;
      graphicsLayer.graphics.forEach(function (g) {
        if (g.attributes.WRI_ID === parseInt(id)) {
          app.map.setExtent(g.geometry.getExtent(), true);
          // Pass the Feature to Component StepTwo.js, he will update his state to completed is true, and he will 
          // have a feature to display in the Current feature for analysis section
          self.props.updateAnalysisArea(g);
        }
      });
    },

    _clearFeatures: function () {
      customFeatures = [];
      this.setState(getDefaultState());
      graphicsLayer.clear();
      this.props.updateAnalysisArea();
    },

    _activateToolbar: function (evt) {

      // If any other tools are active, remove the active class
      dojoQuery(".drawing-tool-button").forEach(function (node) {
        domClass.remove(node, "active");
      });

      // If they clicked the same button twice, deactivate the toolbar
      if (activeTool === evt.target.innerHTML) {
        this._deactivateToolbar();
        return;
      }

      activeTool = evt.target.innerHTML;

      switch (evt.target.innerHTML) {
        case AnalyzerConfig.customArea.freehandLabel:
          drawToolbar.activate(Draw.FREEHAND_POLYGON);
        break;
        case AnalyzerConfig.customArea.polyLabel:
          drawToolbar.activate(Draw.POLYGON);
        break;
        default:
        break;
      }

      domClass.add(evt.target, "active");

    },

    _drawComplete: function (evt) {
      
      dojoQuery(".drawing-tool-button").forEach(function (node) {
        domClass.remove(node, "active");
      });
      this._deactivateToolbar();

      if (!evt.geometry) {
        return;
      }

      // WRI_ID = Unique ID for Drawn Graphics

      var id = this._nextAvailWRI_ID(),
          graphic = new Graphic(evt.geometry, customFeatureSymbol, {
            "label": "Custom drawn feature " + id,
            "WRI_ID": id
          });

      graphicsLayer.add(graphic);

      // Update the UI
      customFeatures.push(graphic);
      this.setState({
        graphics: customFeatures
      });
    },

    _deactivateToolbar: function () {
      drawToolbar.deactivate();
      activeTool = undefined;
    },

    _nextAvailWRI_ID: function() {
      var i = 0,
          x = 0,
          graphics = graphicsLayer.graphics,
          length = graphics.length,
          temp;
      for (i; i < length; i++) {
        if (graphics[i].geometry.type !== "point") {
          temp = parseInt(graphics[i].attributes.WRI_ID);
          if (!isNaN(temp)) {
            x = (x > temp) ? x : temp;
          }
        }
      }
      return (x + 1);
    }

  });

});