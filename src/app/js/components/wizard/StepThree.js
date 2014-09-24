define([
	"react",
  "analysis/config",
  "components/wizard/WizardCheckbox"
], function (React, AnalyzerConfig, WizardCheckbox) {

  var config = AnalyzerConfig.stepThree;

  function getDefaultState() {
    return {
      completed: false
    };
  }

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {

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
            'label': config.suit.label,
            'value': config.suit.value,
            'change': this._selectionMade, 
            'isResetting': this.props.isResetting
          }),
          React.DOM.p({'className': 'layer-description'}, config.suit.description),
          new WizardCheckbox({
            'label': config.rspo.label,
            'value': config.rspo.value,
            'change': this._selectionMade, 
            'isResetting': this.props.isResetting
          }),
          React.DOM.p({'className': 'layer-description'}, config.rspo.description),
          React.DOM.div({'className': 'step-sub-header'}, "Forest Change Analysis Variables"),
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
      return (document.querySelectorAll(".select-analysis .wizard-checkbox.active").length > 0);
    },

    _getPayload: function () {
      var nodes = document.querySelectorAll(".select-analysis .wizard-checkbox"),
          payload = {},
          value;

      Array.prototype.forEach.call(nodes, function (node) {
        value = node.dataset.value;
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