define([
	"react",
  "analysis/config",
  "analysis/WizardStore",
  "esri/graphic",
  "esri/toolbars/draw",
  "dojo/dom",
  "dojo/query",
  "dojo/dom-class",
  "map/config",
  "map/MapModel",
  "map/Uploader",
  "map/Symbols",
  "utils/GeoHelper",
  "components/featureList/FeatureList"
], function (React, AnalyzerConfig, WizardStore, Graphic, Draw, dom, dojoQuery, domClass, MapConfig, MapModel, Uploader, Symbols, GeoHelper, FeatureList) {

  var drawToolbar,
      activeTool;

  var KEYS = AnalyzerConfig.STORE_KEYS;

  function getDefaultState() {
    return {
      graphics: []
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
      // Register Callbacks
      WizardStore.registerCallback(KEYS.customFeatures, this.graphicsListUpdated);
    },

    graphicsListUpdated: function () {
      var newGraphicsList = WizardStore.get(KEYS.customFeatures);
      this.setState({ graphics: newGraphicsList });
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
        this._deactivateToolbar();
        this._removeActiveClass();
      }
    },

    render: function () {
      return (
        React.DOM.div({'className': 'custom-area'},
          React.DOM.p({'className': 'drawing-instructions'}, AnalyzerConfig.customArea.instructions),
          React.DOM.div({'className': 'drawing-tools'},
            React.DOM.div({'className': 'drawing-tool-button', 'onClick': this._activateToolbar, 'id': 'draw-freehand' }, AnalyzerConfig.customArea.freehandLabel),
            React.DOM.div({'className': 'drawing-tool-button', 'onClick': this._activateToolbar, 'id': 'draw-polygon' }, AnalyzerConfig.customArea.polyLabel),
            React.DOM.div({'className': 'drawing-tool-button', 'onClick': Uploader.toggle.bind(Uploader), 'id': 'draw-upload' }, AnalyzerConfig.customArea.uploadLabel)
          ),
          React.DOM.div({'className': 'custom-graphics-list-container'},
            // React.DOM.div({'className': 'clear-custom-features', 'onClick': this._clearFeatures}, "clear all"),
            React.DOM.div({'className': 'drawing-instructions'}, AnalyzerConfig.customArea.instructionsPartTwo),
            new FeatureList({ 'features': this.state.graphics })
            // this.state.graphics.map(this._graphicsMapper, this)
          )
        )
      );
    },

    // _graphicsMapper: function (item) {
    //   var analysisArea = WizardStore.get(KEYS.selectedCustomFeatures);
    //   var existsSelection = analysisArea !== undefined;
    //   var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
    //   var isAreaOfInterestCustom = selectedAreaOfInterest === 'customAreaOption';
    //   var className = isAreaOfInterestCustom && existsSelection && (item.attributes.WRI_ID == analysisArea.attributes.WRI_ID) ? 'custom-feature-row active' : 'custom-feature-row';

    //   return React.DOM.div(
    //     {
    //       'className': className,
    //       'onClick': this._chooseGraphic,
    //       'data-feature-id': item.attributes.WRI_ID
    //     },
    //     React.DOM.input({
    //       'className':'custom-feature-label',
    //       'type': 'text',
    //       'placeholder': 'Feature name',
    //       'size': item.attributes[AnalyzerConfig.stepTwo.labelField].length - 3,
    //       'value': item.attributes[AnalyzerConfig.stepTwo.labelField],
    //       'data-feature-id': item.attributes.WRI_ID,
    //       'onChange': this._renameGraphic
    //     })
    //   );
    // },

    _renameGraphic: function(evt) {
      var graphic = customFeatures[evt.target.parentNode.dataset.featureId - 1],
          name;

      if (graphic) {
        graphic.attributes[AnalyzerConfig.stepTwo.labelField] = evt.target.value;
        this.setState(getDefaultState());
        if (evt.target.parentNode.className.split(' ').indexOf('active') > -1) {
          WizardStore.set(KEYS.selectedCustomFeatures, graphic);
        }
      }

    },

    _instructionsMapper: function (item) {
      return React.DOM.li(null, item);
    },

    _clearFeatures: function () {
      customFeatures = [];
      this.setState(getDefaultState());
      // Reset this key to undefined
      WizardStore.set(KEYS.selectedCustomFeatures);
      // Reset the customFeatures to Empty
      WizardStore.set(KEYS.customFeatures, []);
      // Deactivate all the tools if active
      this._deactivateToolbar();
      this._removeActiveClass();
    },

    _activateToolbar: function (evt) {

      // If any other tools are active, remove the active class
      this._removeActiveClass();

      // Hide the Upload tools if visible
      this.setState({ showUploadTools: false });

      // If they clicked the same button twice, deactivate the toolbar
      if (activeTool === evt.target.id) {
        this._deactivateToolbar();
        return;
      }

      activeTool = evt.target.id;

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

      // Update the Model so other parts of the application can be aware of this
      MapModel.set('drawToolsEnabled', true);

    },

    _drawComplete: function (evt) {
      
      this._removeActiveClass();
      this._deactivateToolbar();

      if (!evt.geometry) {
        return;
      }

      // WRI_ID = Unique ID for Drawn Graphics
      var id = GeoHelper.nextCustomFeatureId(),
          attrs = { "WRI_ID": id },
          graphic;

      // Add a Label
      attrs[AnalyzerConfig.stepTwo.labelField] = "ID - " + id + ": Custom drawn feature";
      graphic = new Graphic(evt.geometry, Symbols.getPolygonSymbol(), attrs);
      WizardStore.set(KEYS.customFeatures, WizardStore.get(KEYS.customFeatures).concat([graphic]));

    },

    _deactivateToolbar: function () {
      drawToolbar.deactivate();
      activeTool = undefined;
      MapModel.set('drawToolsEnabled', false);
    },

    _removeActiveClass: function () {
      dojoQuery(".drawing-tools .drawing-tool-button").forEach(function (node) {
        domClass.remove(node, "active");
      });
    },

    _chooseGraphic: function (evt) {
      var id = evt.target.dataset ? evt.target.dataset.featureId : evt.target.getAttribute("data-feature-id"),
          graphicsLayer = app.map.getLayer(MapConfig.customGraphicsLayer.id),
          self = this;

      graphicsLayer.graphics.forEach(function (g) {
        if (g.attributes.WRI_ID === parseInt(id)) {
          GeoHelper.zoomToFeature(g);
          WizardStore.set(KEYS.selectedCustomFeatures, g);
        }
      });
    }

  });

});