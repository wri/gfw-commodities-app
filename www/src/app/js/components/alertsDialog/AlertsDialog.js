/** @jsx React.DOM */
define([
  // libs
  'react',
  'lodash',
  // src
  'components/alertsDialog/config',
  'analysis/WizardStore',
  // esri/dojo
  'dojo/dom-class'
], function (React, _, Config, WizardStore, domClass) {

  var AlertsDialog,
      getDefaultState,
      KEYS = Config.STORE_KEYS,
      TEXT = Config.TEXT,
      self = this;

  // NOTE: form attributes/text
  var pbVal,
      pbId1,
      pbId2,
      formaId = Config.FORMA_ID,
      firesId = Config.FIRES_ID,
      emailId = _.uniqueId(),
      subscriptionNameId = _.uniqueId();

  getDefaultState = function () {
    return {
      features: []
    };
  }

  AlertsDialog = React.createClass({displayName: 'AlertsDialog',
    getInitialState: getDefaultState,

    componentDidMount: function () {
      // NOTE: for live developing, remove when finished
      WizardStore.registerCallback(KEYS.alertsDialogActive, function () {
        this.setState(this.getInitialState({temp:'temp'}));
      }.bind(this));

      if (WizardStore.get(KEYS.alertsDialogActive) === true) {
        domClass.add(Config.MOUNT_ID, 'active');
      }
    },

    render: function () {
      var temp = true,
          radiusSelect;

      if (temp) {
        radiusSelect = (
          React.DOM.div({className: "margin__bottom"}, 
            React.DOM.span({className: "margin__left"}, "Buffer size:"), 
            React.DOM.select({className: "margin__left"}, 
              TEXT.bufferOptions.map(function (option) {
                return React.DOM.option({value: option[0]}, option[1])
              })
            )
          )
        )
      }

      return (
        React.DOM.div(null, 
          React.DOM.div({className: "close-icon"}), 
          React.DOM.div({className: "modal-content"}, 
            React.DOM.div({className: "alerts-form__form no-wide border-box"}, 
              React.DOM.div({className: "modal-header"}, TEXT.title), 
              React.DOM.div({className: "margin__bottom"}, 
                React.DOM.input({className: "vertical-middle", type: "checkbox", onChange: this._checkboxChange}), 
                React.DOM.label({className: "vertical-middle"}, TEXT.forma)
              ), 
              React.DOM.div({className: "margin__bottom"}, 
                React.DOM.input({className: "vertical-middle", type: "checkbox", onChange: this._checkboxChange}), 
                React.DOM.label({className: "vertical-middle"}, TEXT.fires)
              ), 
              React.DOM.div({className: "pooh-bear text-center"}, 
                React.DOM.div({className: "pooh-bear"}, "Please leave this blank"), 
                React.DOM.input({className: "pooh-bear", type: "text", name: "name"})
              ), 
              radiusSelect, 
              React.DOM.div({className: "text-center margin__bottom"}, 
                React.DOM.input({className: "border-medium-gray border-radius", type: "text", placeholder: TEXT.subscriptionPlaceholder})
              ), 
              React.DOM.div({className: "text-center margin__bottom"}, 
                React.DOM.input({className: "border-medium-gray border-radius", type: "text", placeholder: TEXT.emailPlaceholder})
              ), 
              React.DOM.div({className: "pooh-bear text-center"}, 
                React.DOM.div({className: "pooh-bear"}, "Please do not change this field"), 
                React.DOM.input({className: "pooh-bear", type: "text", name: "address"})
              ), 
              React.DOM.div({className: "text-right margin__bottom"}, 
                React.DOM.button({className: "text-white back-orange no-border border-radius font-16px"}, TEXT.subscribe)
              )
            )
          )
        )
      )
    },

    _checkboxChange: function () {
      console.debug('TODO: _checkboxChange');
    }
  });

  return function () {
    return React.renderComponent(new AlertsDialog, document.getElementById(Config.MOUNT_ID));
  };
});
