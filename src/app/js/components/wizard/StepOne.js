define([
	"react"
], function (React) {

  // Variables
  var title = "Step 1: Select Area",
      option1 = 'Create custom area',
      option2 = 'Administrative unit',
      option3 = 'Commercial entity',
      option4 = 'Certified area',
      option5 = 'Mill point';
  
  // Helper Functions
  function getDefaultState() {
    return {
      completed: true,
      selectedOption: 'adminUnitOption'
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
        React.DOM.div({'className': 'step'},
          React.DOM.div({'className': 'step-title'}, title),
          React.DOM.div({'className': 's1-radio-container'},
            React.DOM.input({'id': 'customAreaOption', 'type': 'radio', onChange: this._changeSelection,'name': 'first-step', 'checked': this.state.selectedOption === 'customAreaOption'}),
            React.DOM.label({'htmlFor': 'customAreaOption'}, option1)
          ),
          React.DOM.div({'className': 's1-radio-container'},
            React.DOM.input({'id': 'adminUnitOption', 'type': 'radio', onChange: this._changeSelection, 'name': 'first-step', 'checked': this.state.selectedOption === 'adminUnitOption'}),
            React.DOM.label({'htmlFor': 'adminUnitOption'}, option2)
          ),
          React.DOM.div({'className': 's1-radio-container'},
            React.DOM.input({'id': 'commercialEntityOption', 'type': 'radio', onChange: this._changeSelection, 'name': 'first-step', 'checked': this.state.selectedOption === 'commercialEntityOption'}),
            React.DOM.label({'htmlFor': 'commercialEntityOption'}, option3)
          ),
          React.DOM.div({'className': 's1-radio-container'},
            React.DOM.input({'id': 'certifiedAreaOption', 'type': 'radio', onChange: this._changeSelection, 'name': 'first-step', 'checked': this.state.selectedOption === 'certifiedAreaOption'}),
            React.DOM.label({'htmlFor': 'certifiedAreaOption'}, option4)
          ),
          React.DOM.div({'className': 's1-radio-container'},
            React.DOM.input({'id': 'millPointOption', 'type': 'radio', onChange: this._changeSelection, 'name': 'first-step', 'checked': this.state.selectedOption === 'millPointOption'}),
            React.DOM.label({'htmlFor': 'millPointOption'}, option5)
          ),
          React.DOM.div({'className':'next-button-container'},
            React.DOM.span({'className': 'next-button', onClick: this._moveOn }, "Next")
          )
        )
      );
    },

    _changeSelection: function (e) {
      this.setState({
        selectedOption: e.target.id
      });
      this.props.callback.update(e.target.id);
    },

    _moveOn: function () {
      this.props.callback.nextStep();
    }

  });

});