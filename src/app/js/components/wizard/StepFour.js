define([
  "react",
  "analysis/config",
  "components/wizard/WizardCheckbox"
], function (React, AnalyzerConfig, WizardCheckbox) {

  var config = AnalyzerConfig.stepFour;

  function getDefaultState() {
    return {
      completed: true
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
        React.DOM.div({'className': 'step refine-analysis'},
          React.DOM.div({'className': 'step-title'}, config.title),
          React.DOM.p({'className': 'step-description'}, config.description),
          config.checkboxes.map(this._mapper, this),
          React.DOM.div({'className':'next-button-container'},
            React.DOM.span({
              'className': 'next-button ' + (this.state.completed ? '' : 'disabled'), 
              'onClick': this._proceed 
            }, "Perform Analysis")
          )
        )
      );
    },

    _mapper: function (item) {
      return new WizardCheckbox({
        'label': item.label,
        'value': item.value,
        'change': this._selectionMade,
        'isResetting': this.props.isResetting, // Pass Down so Components receive the reset command
        'defaultChecked': item.checked || false
      });
    },

    _selectionMade: function (checked) {
      this.setState({
        completed: this._checkRequirements()
      });
    },

    _checkRequirements: function () {
      // Requirements are that at least one checkbox is selected
      return (document.querySelectorAll(".refine-analysis .wizard-checkbox.active").length > 0);
    },

    _getPayload: function () {
      var nodes = document.querySelectorAll(".refine-analysis .wizard-checkbox"),
          payload = {},
          value;

      Array.prototype.forEach.call(nodes, function (node) {
        value = node.dataset ? node.dataset.value : node.getAttribute('data-value');
        payload[value] = (node.className.search('active') > -1);
      });

      return payload;
    },

    _proceed: function () {
      if (this.state.completed) {
        var payload = this._getPayload();
        this.props.callback.updateAnalysisDatasets(payload);
        this.props.callback.performAnalysis();
      }
    }


  });

});