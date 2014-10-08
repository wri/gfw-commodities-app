define([
	"react",
  "analysis/config"
], function (React, AnalyzerConfig) {

  // Variables
  var config = AnalyzerConfig.stepOne, 
      title = config.title,
      description = config.description,
      option1 = config.option1,
      option2 = config.option2,
      option3 = config.option3,
      option4 = config.option4,
      option5 = config.option5;
  
  // Helper Functions
  function getDefaultState() {
    return {
      completed: true,
      selectedOption: option2.id
    };
  }

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      this.props.callback.update(getDefaultState().selectedOption);
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        var defaults = getDefaultState();
        this.replaceState(defaults);
        this.props.callback.update(defaults.selectedOption);
      } else if (newProps.selectedArea) {
        this.setState({
          selectedOption: newProps.selectedArea
        });
      }
    },

    render: function () {
      return (
        React.DOM.div({'className': 'step'},
          React.DOM.div({'className': 'step-body'},
            React.DOM.div({'className': 'step-title'}, title),
            React.DOM.p({'className': 'step-one-main-description'}, description),
            React.DOM.div({'className': 's1-radio-container'},
              React.DOM.input({'id': option1.id, 'type': 'radio', onChange: this._changeSelection,'name': 'first-step', 'checked': this.state.selectedOption === option1.id}),
              React.DOM.label({'htmlFor': option1.id}, option1.label),
              React.DOM.p({'className': 'step-one-option-description'}, option1.description)
            ),
            React.DOM.div({'className': 's1-radio-container'},
              React.DOM.input({'id': option2.id, 'type': 'radio', onChange: this._changeSelection, 'name': 'first-step', 'checked': this.state.selectedOption === option2.id}),
              React.DOM.label({'htmlFor': option2.id}, option2.label),
              React.DOM.p({'className': 'step-one-option-description'}, option2.description)
            ),
            React.DOM.div({'className': 's1-radio-container'},
              React.DOM.input({'id': option3.id, 'type': 'radio', onChange: this._changeSelection, 'name': 'first-step', 'checked': this.state.selectedOption === option3.id}),
              React.DOM.label({'htmlFor': option3.id}, option3.label),
              React.DOM.p({'className': 'step-one-option-description'}, option3.description)
            ),
            React.DOM.div({'className': 's1-radio-container'},
              React.DOM.input({'id': option4.id, 'type': 'radio', onChange: this._changeSelection, 'name': 'first-step', 'checked': this.state.selectedOption === option4.id}),
              React.DOM.label({'htmlFor': option4.id}, option4.label),
              React.DOM.p({'className': 'step-one-option-description'}, option4.description)
            ),
            React.DOM.div({'className': 's1-radio-container'},
              React.DOM.input({'id': option5.id, 'type': 'radio', onChange: this._changeSelection, 'name': 'first-step', 'checked': this.state.selectedOption === option5.id}),
              React.DOM.label({'htmlFor': option5.id}, option5.label),
              React.DOM.p({'className': 'step-one-option-description'}, option5.description)
            )
          ),
          React.DOM.div({'className': 'step-footer'},
            React.DOM.div({'className':'next-button-container', onClick: this._moveOn},
              React.DOM.span({'className': 'next-button' }, "Next")
            )
          )
        )
      );
    },

    _changeSelection: function (e) {
      // this.setState({
      //   selectedOption: e.target.id
      // });
      this.props.callback.update(e.target.id);
    },

    _moveOn: function () {
      this.props.callback.nextStep();
    }

  });

});