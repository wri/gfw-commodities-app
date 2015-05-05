define([
	"react",
  "analysis/config",
  "analysis/WizardStore",
  "components/wizard/WizardCheckbox"
], function (React, AnalyzerConfig, WizardStore, WizardCheckbox) {

  var config = AnalyzerConfig.stepThree;
  var KEYS = AnalyzerConfig.STORE_KEYS;

  function getDefaultState() {
    return {
      completed: true,
      showForestChangeChildren: true
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
        React.DOM.div({'className': 'step select-analysis'},
          React.DOM.div({'className': 'step-title'}, config.title),
          React.DOM.p({'className': 'step-description'}, config.description),
          new WizardCheckbox({
            'label': config.cb1.label,
            'value': config.cb1.value,
            'change': this._showChildren, 
            'isResetting': this.props.isResetting,
            'defaultChecked': true
          }),
          React.DOM.div({'className': 'child-checkboxes ' + (this.state.showForestChangeChildren ? '' : 'hidden')},
            new WizardCheckbox({
              'label': config.cb2.label,
              'value': config.cb2.value,
              'change': this._selectionMade, 
              'isResetting': this.props.isResetting,
              'defaultChecked': true,
            }),
            new WizardCheckbox({
              'label': config.cb3.label,
              'value': config.cb3.value,
              'change': this._selectionMade, 
              'isResetting': this.props.isResetting
            })
          ),
          new WizardCheckbox({
            'label': config.cb4.label,
            'value': config.cb4.value,
            'change': this._selectionMade, 
            'isResetting': this.props.isResetting
          }),
          React.DOM.div({'className': (this.props.selectedArea === config.millPoint ? '' : 'hidden')},
            new WizardCheckbox({
              'label': config.cb5.label,
              'value': config.cb5.value,
              'change': this._selectionMade, 
              'isResetting': this.props.isResetting
            })
          ),
          React.DOM.div({'className':'next-button-container'},
            React.DOM.span({
              'className': 'next-button ' + (this.state.completed ? '' : 'disabled'), 
              'onClick': this._proceed 
            }, "Next")
          )
        )
      );
    },

    _showChildren: function (checked) {
      this.setState({
        showForestChangeChildren: checked
      });
      this._checkRequirements();
    },

    _selectionMade: function (checked) {
      this._checkRequirements();
    },

    _checkRequirements: function () {
      var nodes = document.querySelectorAll(".select-analysis .wizard-checkbox.active"),
          activeValues = [],
          completed = false,
          value;
      
      Array.prototype.forEach.call(nodes, function (node) {
        value = node.dataset ? node.dataset.value : node.getAttribute('data-value');
        activeValues.push(value);
      });

      // If any one of these cases pass, we are safe to move on
      // if cb1 and either cb2 or cb3 are active
      if (activeValues.indexOf(config.cb1.value) > -1 && 
          (activeValues.indexOf(config.cb2.value) > -1 || activeValues.indexOf(config.cb3.value) > -1)) {
        completed = true;
      }
      // if cb4 is active
      if (activeValues.indexOf(config.cb4.value) > -1) {
        completed = true;
      }
      // if cb5 is active
      if (activeValues.indexOf(config.cb5.value) > -1) {
        completed = true;
      }

      this.setState({
        completed: completed
      });
    },

    _getPayload: function () {
      var nodes = document.querySelectorAll(".select-analysis .wizard-checkbox"),
          payload = {},
          value;

      Array.prototype.forEach.call(nodes, function (node) {
        value = node.dataset ? node.dataset.value : node.getAttribute('data-value');
        payload[value] = (node.className.search('active') > -1);
      });

      // If Forest Change(cb1) is false, make sure that Tree Cover Loss(cb2) and Forma Alerts(cb3) are also false,
      // If more children are added below risk(cb4) and suit(cb5), this is place to handle those cases as well
      if (!payload[config.cb1.value]) {
        payload[config.cb2.value] = false;
        payload[config.cb3.value] = false;
      }

      // Remove Forest Change from the payload as it is not part of the analysis, its just a parent category
      // If more children are added below risk(cb4) and suit(cb5), this is place to remove parents
      delete payload[config.cb1.value];

      return payload;
    },

    _proceed: function () {
      if (this.state.completed) {
        var payload = this._getPayload();
        WizardStore.set(KEYS.analysisSets, payload);
        this.props.callback.nextStep();
      }
    }


  });

});