define([
  // libs
  'react',
  'lodash',
  // src
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
  'esri/geometry/Polygon',
  'esri/toolbars/draw',
  'dojo/topic',
  'dojo/dom',
  'dojo/query',
  'dojo/dom-class',
  'dojo/Deferred',
  'dojo/promise/all',
  'dojo/request/xhr',
  'dojox/validate/web'
], function (React, _, WizardStore, AlertsConfig, FeatureList, MapConfig, MapModel, Uploader, Symbols, GeoHelper, Graphic, Polygon, Draw, topic, dom, dojoQuery, domClass, Deferred, all, xhr, validate) {

  var AlertsForm,
      drawToolbar,
      activeTool,
      TEXT = AlertsConfig.TEXT,
      KEYS = AlertsConfig.STORE_KEYS,
      getDefaultState,
      self = this;

  getDefaultState = function () {
    return {
      features: WizardStore.get(KEYS.customFeatures),
      selectedFeatures: WizardStore.get(KEYS.selectedCustomFeatures)
    }
  }

  AlertsForm = React.createClass({

    getInitialState: getDefaultState,

    componentDidMount: function () {
      drawToolbar = new Draw(app.map);
      drawToolbar.on('draw-end', this._drawComplete);

      WizardStore.registerCallback(KEYS.customFeatures, function () {
        this.setState({features: WizardStore.get(KEYS.customFeatures)});
      }.bind(this));

      WizardStore.registerCallback(KEYS.selectedCustomFeatures, function () {
        this.setState({selectedFeatures: WizardStore.get(KEYS.selectedCustomFeatures)});
      }.bind(this));

      this.setState(getDefaultState());
    },

    componentWillReceiveProps: function (newProps) {
      // Update state with newly received props
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
        this._deactivateToolbar();
        this._removeActiveClass();
      }
    },

    render: function () {
      var currentFeatures = WizardStore.get(KEYS.selectedCustomFeatures),
          currentSelectionLabel = currentFeatures.length > 0 ? currentFeatures.map(function (feature) {return feature.attributes.WRI_label}).join(', ') : TEXT.noSelection,
          self = this;

      return (
        React.DOM.div({className: 'relative fill'},
          // Header
          React.DOM.div({className: 'alerts-form__header'},
            React.DOM.div({className: 'alerts-form__header__title inline-block fill__long border-box padding__long vertical-middle'}, TEXT.title),
            React.DOM.button({'onClick': this._toggle, className: 'alerts-form__header__exit back-white absolute no-top no-right no-padding fill__long pointer'}, 
              React.DOM.img({'className': 'vertical-middle', 'src': 'app/css/images/close_symbol.png'})
            )
          ),
          // Body
          React.DOM.div({className: 'alerts-form__body'}, 
            // Tools
            React.DOM.div({'className':'padding__wide padding__top'},
              React.DOM.div({'className':'margin__bottom'}, AlertsConfig.customArea.instructions),
              React.DOM.div({'className':'text-center margin__bottom'},
                React.DOM.button({'className':'alerts-form__drawing-tool no-border border-radius margin padding pointer', 'onClick': this._activateToolbar, 'data-geometry-type': Draw.FREEHAND_POLYGON}, AlertsConfig.customArea.freehandLabel),
                React.DOM.button({'className':'alerts-form__drawing-tool no-border border-radius margin padding pointer', 'onClick': this._activateToolbar, 'data-geometry-type': Draw.POLYGON}, AlertsConfig.customArea.polyLabel),
                React.DOM.button({'className':'alerts-form__drawing-tool no-border border-radius margin padding pointer', 'onClick': Uploader.toggle.bind(Uploader), 'id':'alerts-draw-upload' }, AlertsConfig.customArea.uploadLabel)
              )
            ),
            // Features
            new FeatureList({'features': this.state.features, 'selectedFeatures': this.state.selectedFeatures})
          ),
          // Footer
          React.DOM.div({className:'alerts-form__footer'}, 
            React.DOM.div({className:'inline-block padding__left'}, TEXT.selection),
            React.DOM.div({className:'alerts-form__footer__selection absolute inline-block padding__wide text-gold ellipsis border-box', title:currentSelectionLabel}, currentSelectionLabel),
            React.DOM.button({className:'text-white back-orange no-border fill__long pointer absolute no-right no-top', onClick:this._subscribeToAlerts, disabled:(this.state.selectedFeatures.length === 0)}, TEXT.subscribe)
          )
        )
      );
    },

    _toggle: function () {
      topic.publish('toggleAlerts');
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

    _deactivateToolbar: function () {
      drawToolbar.deactivate();
      activeTool = undefined;
      MapModel.set('drawToolsEnabled', false);
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

      attrs[AlertsConfig.stepTwo.labelField] = "ID - " + id + ": Custom drawn feature";

      WizardStore.set(KEYS.customFeatures, WizardStore.get(KEYS.customFeatures).concat([feature]));
    },

    _removeActiveClass: function () {
      dojoQuery(".alerts-form__body .alerts-form__drawing-tool").forEach(function (node) {
        domClass.remove(node, "active");
      });
    },

    _subscribeToAlerts: function () {
      WizardStore.set(KEYS.alertsDialogActive, !WizardStore.get(KEYS.alertsDialogActive));
    }
  });

  return function (props, el) {
    return React.renderComponent(new AlertsForm(props), document.getElementById(el));
  };
});
