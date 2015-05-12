define([
  // libs
  'react',
  'lodash',
  // src
  'analysis/WizardStore',
  'components/alertsForm/config',
  'components/alertsForm/AlertsFormHelper',
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
  'dojo/dom-class',
  'dojox/validate/web'
], function(React, _, WizardStore, AlertsConfig, AlertsFormHelper, FeatureList, MapConfig, MapModel, Uploader, Symbols, GeoHelper, Graphic, Draw, dom, dojoQuery, domClass, validate) {

  var AlertsForm,
    drawToolbar,
    activeTool,
    KEYS = AlertsConfig.STORE_KEYS,
    getDefaultState,
    formaId = _.uniqueId(),
    firesId = _.uniqueId(),
    emailId = _.uniqueId()
    self = this;

  getDefaultState = function() {
    return {
      features: WizardStore.get(KEYS.customFeatures),
      selectedFeatures: WizardStore.get(KEYS.selectedCustomFeatures)
    }
  }

  AlertsForm = React.createClass({

    getInitialState: getDefaultState,

    componentDidMount: function() {
      drawToolbar = new Draw(app.map);
      drawToolbar.on('draw-end', this._drawComplete);

      WizardStore.registerCallback(KEYS.customFeatures, function() {
        this.setState({features: WizardStore.get(KEYS.customFeatures)});
      }.bind(this));

      WizardStore.registerCallback(KEYS.selectedCustomFeatures, function() {
        this.setState({selectedFeatures: WizardStore.get(KEYS.selectedCustomFeatures)});
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
      var currentFeatures = WizardStore.get(KEYS.selectedCustomFeatures),
          currentSelectionLabel = currentFeatures.length > 0 ? currentFeatures.map(function (feature) {return feature.attributes.WRI_label}).join(',') : 'none',
          toggleAlertsForm = function() {console.log('TODO: toggleAlertsForm')};


      return (
        React.DOM.div({className: 'relative fill'},
          // Header
          React.DOM.div({className: 'alerts-form__header'},
            React.DOM.div({className: 'fill__long border-box padding'}, 'Alerts Registration'),
            React.DOM.button({'onClick': toggleAlertsForm, className: 'back-white absolute no-top no-right fill__long pointer'}, 'x')
          ),
          // Body
          React.DOM.div({className: 'alerts-form__body'}, 
            // Tools
            React.DOM.div({'className':'padding__wide padding__top'},
              React.DOM.div(null, AlertsConfig.customArea.instructions),
              React.DOM.div({'className':'text-center'},
                React.DOM.button({'onClick': this._activateToolbar, 'data-geometry-type': Draw.FREEHAND_POLYGON}, AlertsConfig.customArea.freehandLabel),
                React.DOM.button({'onClick': this._activateToolbar, 'data-geometry-type': Draw.POLYGON}, AlertsConfig.customArea.polyLabel),
                React.DOM.button({'onClick': Uploader.toggle.bind(Uploader), 'id':'alerts-draw-upload' }, AlertsConfig.customArea.uploadLabel)
              )
            ),
            // Features
            new FeatureList({'features': this.state.features, 'selectedFeatures': this.state.selectedFeatures}),
            // Subscription options
            // TODO: group registration name, should default to store alias as placeholder
            // TODO: honeypot fields
            React.DOM.div({'className':'alerts-form__form absolute no-wide border-box', 'style': {bottom:'51px'}},
              React.DOM.div(null,
                React.DOM.input({className:'vertical-middle', type: 'checkbox', id:formaId}),
                React.DOM.label({className:'vertical-middle', htmlFor:formaId}, 'Monthly Clearance Alerts')
              ),
              React.DOM.div(null,
                React.DOM.input({className:'vertical-middle', type: 'checkbox', id:firesId}),
                React.DOM.label({className:'vertical-middle', htmlFor:firesId}, 'Fire Alerts')
              ),
              React.DOM.div({className:'text-center'},
                React.DOM.input({placeholder:currentSelectionLabel})
              ),
              React.DOM.div({className:'text-center'},
                React.DOM.input({id:emailId, placeholder:'something@gmail.com'})
              )
            )
          ),
          // Footer
          React.DOM.div({className:'alerts-form__footer'}, 
            React.DOM.div({className:'inline-block padding__left'}, 'Current Selection:'),
            React.DOM.div({className:'inline-block padding__left text-gold'}, currentSelectionLabel),
            React.DOM.button({className:'text-white back-orange no-border fill__long pointer absolute no-right no-top', onClick:this._subscribeToAlerts}, 'Subscribe')
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

      attrs[AlertsConfig.stepTwo.labelField] = "ID - " + id + ": Custom drawn feature";

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
    }, 

    // @ Generator.js:subscribeToAlerts
    _subscribeToAlerts: function () {
      // NOTE: convertGeometryToGeometry is available in GeoHelper
      // var geoJson = this.convertGeometryToGeometric(report.geometry),
      var geoJson,
          emailAddr = dom.byId(emailId).value,
          formaCheck = dom.byId(formaId).checked,
          firesCheck = dom.byId(firesId).checked,
          errorMessages = [],
          messages = {},
          displayMessages;

      console.debug(geoJson);

      // Set up the text for the messages
      messages.invalidEmail = 'You must provide a valid email in the form.';
      messages.noAreaSelection = 'You must select at least one area from the list.';
      messages.noSelection = 'You must select at least one checkbox from the form.';
      messages.formaSuccess = 'Thank you for subscribing to Forma Alerts.  You should receive a confirmation email soon.';
      messages.formaFail = 'There was an error with your request to subscribe to Forma alerts.  Please try again later.';
      messages.fireSuccess = 'Thank you for subscribing to Fires Alerts.  You should receive a confirmation email soon.';
      messages.fireFail = 'There was an error with your request to subscribe to Fires alerts.  Please try again later.';

      if (this.state.selectedFeatures > 0) {
        // TODO: create signle subscribe polygon from all selected features
        emailAddr = this.state.selectedFeatures[0].toJson();
      } else {
        errorMessages.push(messages.noAreaSelection)
      }

      if (!validate.isEmailAddress(emailAddr)) {
          errorMessages.push(messages.invalidEmail);
      }

      if (!formaCheck && !firesCheck) {
          errorMessages.push(messages.noSelection);
      }

      displayMessages = function () {
        // generic messages popup, use this instead of putting responses AlertsForm panel
      }

      if (errorMessages.length > 0) {
          alert('Please fill in the following:\n' + errorMessages.join('\n'));
      } else {
        // If both are checked, request both and show the appropriate responses
        if (formaCheck && firesCheck) {
            // var responses = [];
            // all([
            //     this.subscribeToForma(geoJson, emailAddr),
            //     this.subscribeToFires(report.geometry, emailAddr)
            // ]).then(function(results) {
            //     // Check the results and inform the user of the results
            //     if (results[0]) {
            //         responses.push(messages.formaSuccess);
            //     } else {
            //         responses.push(messages.formaFail);
            //     }

            //     if (results[1]) {
            //         responses.push(messages.fireSuccess);
            //     } else {
            //         responses.push(messages.fireFail);
            //     }

            //     dom.byId('form-response').innerHTML = responses.join('<br />');
            // });

            // Else if just forma alerts are checked, subscribe to those and show the correct responses
        } else if (formaCheck) {
            // this.subscribeToForma(geoJson, emailAddr).then(function(res) {
            //     if (res) {
            //         dom.byId('form-response').innerHTML = messages.formaSuccess;
            //     } else {
            //         dom.byId('form-response').innerHTML = messages.formaFail;
            //     }
            // });
            // Else if just fires alerts are checked, subscribe to those and show the correct responses
        } else if (firesCheck) {
            // this.subscribeToFires(report.geometry, emailAddr).then(function(res) {
            //     if (res) {
            //         dom.byId('form-response').innerHTML = messages.fireSuccess;
            //     } else {
            //         dom.byId('form-response').innerHTML = messages.fireFail;
            //     }
            // });
        }
      }
    }

  });

  return function(props, el) {
    return React.renderComponent(new AlertsForm(props), document.getElementById(el));
  };

});
