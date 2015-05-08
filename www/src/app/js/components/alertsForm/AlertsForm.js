define([
  // libs
  'react',
  'lodash',
  // src
  'analysis/config',
  'analysis/WizardStore',
  'components/alertsForm/config',
  'components/featureList/FeatureList',
  'map/config',
  'map/MapModel',
  'map/Uploader',
  'map/Symbols',
  'utils/GeoHelper',
  // esri/dojo
  'esri/graphic',
  'esri/toolbars/draw',
  'dojo/dom',
  'dojo/query',
  'dojo/dom-class'
], function(React, _, AnalyzerConfig, WizardStore, AlertsConfig, FeatureList, MapConfig, MapModel, Uploader, Symbols, GeoHelper, Graphic, Draw, dom, dojoQuery, domClass) {

  var AlertsForm,
    drawToolbar,
    activeTool,
    KEYS = AnalyzerConfig.STORE_KEYS,
    getDefaultState,
    self = this;

  getDefaultState = function() {
    return {
      features: WizardStore.get(KEYS.customFeatures)
    }
  }

  AlertsForm = React.createClass({

    getInitialState: getDefaultState,

    componentDidMount: function() {
      // Initialize
      drawToolbar = new Draw(app.map);
      drawToolbar.on('draw-end', this._drawComplete);

      WizardStore.registerCallback(KEYS.customFeatures, function() {
        this.setState({features: WizardStore.get(KEYS.customFeatures)});
      }.bind(this));

      this.setState(getDefaultState());
    },

    componentWillReceiveProps: function(newProps) {
      // Update state with newly received props
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
        this._deactivateToolbar();
        this._removeActiveClass();
      }
    },

    render: function() {
      return (
        React.DOM.div({className: 'alerts-form-root'},
          // Header
          React.DOM.div({className: 'alerts-form-header'},
            React.DOM.div({className: 'padding'}, 'Alerts Registration'),
            React.DOM.button({className: 'absolute no-top no-right'}, 'x')
          ),
          // Body
          React.DOM.div({className: 'alerts-form-body'}, 
            // Tools
            React.DOM.div({'className':'padding__wide padding__top'},
              React.DOM.div({'className':'margin__bottom'}, 'Create a custom Area'),
              React.DOM.div(null, AnalyzerConfig.customArea.instructions),
              React.DOM.div({'className':'text-center'},
                React.DOM.button({'onClick': this._activateToolbar, 'data-geometry-type': Draw.FREEHAND_POLYGON}, AnalyzerConfig.customArea.freehandLabel),
                React.DOM.button({'onClick': this._activateToolbar, 'data-geometry-type': Draw.POLYGON}, AnalyzerConfig.customArea.polyLabel),
                React.DOM.button({'onClick': Uploader.toggle.bind(Uploader), 'id':'alerts-draw-upload' }, AnalyzerConfig.customArea.uploadLabel)
              )
            ),
            // Features
            new FeatureList({'features': this.state.features}),
            // Subscription options
            // TODO: group registration name, should default to store alias as placeholder
            // TODO: honeypot fields
            React.DOM.div({'className':'absolute no-wide border-box padding__wide', 'style': {height:'80px', bottom:'51px'}},
              React.DOM.div(null,
                React.DOM.input({type: 'checkbox', name:'forma-alerts'}),
                React.DOM.label({htmlFor: 'forma-alerts'}, 'Monthly Clearance Alerts')
              ),
              React.DOM.div(null,
                React.DOM.input({type: 'checkbox', name:'fire-alerts'}),
                React.DOM.label({htmlFor: 'fire-alerts'}, 'Fire Alerts')
              ),
              React.DOM.div(null,
                React.DOM.input({placeholder:'something@gmail.com'})
              )
            )
          ),
          // Footer
          React.DOM.div({className: 'alerts-form-footer'}, 
            'Current Selection:',
            '{selection}',
            React.DOM.button({className: 'float-right'}, 'Subscribe')
          )
        )
      );
    },

    _clearFeatures: function () {
      customFeatures = [];
      WizardStore.set(KEYS.customFeatures, []);
      // Deactivate all the tools if active
      this._deactivateToolbar();
      this._removeActiveClass();
    },

    _activateToolbar: function (evt) {
      var geometryType;

      geometryType = evt.target.dataset ? evt.target.dataset.geometryType : evt.target.getAttribute("data-geometry-type")

      // If any other tools are active, remove the active class
      this._removeActiveClass();

      // If they clicked the same button twice, deactivate the toolbar
      if (activeTool === geometryType) {
        this._deactivateToolbar();
        return;
      }

      activeTool = geometryType

      drawToolbar.activate(geometryType);
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

      var id = GeoHelper.nextCustomFeatureId(),
        attrs = { "WRI_ID": id },
        feature = new Graphic(evt.geometry, Symbols.getPolygonSymbol(), attrs);

      attrs[AnalyzerConfig.stepTwo.labelField] = "ID - " + id + ": Custom drawn feature";
      WizardStore.set(KEYS.customFeatures, WizardStore.get(KEYS.customFeatures).concat([feature]));
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
    }
  });

  return function(props, el) {
    return React.renderComponent(new AlertsForm(props), document.getElementById(el));
  };

});
