define([
	"react",
  "analysis/config",
  "analysis/WizardStore"
], function (React, AnalyzerConfig, WizardStore) {

  // Variables
  var config = AnalyzerConfig.stepOne, 
      title = config.title,
      description = config.description,
      option1 = config.option1,
      option2 = config.option2,
      option3 = config.option3,
      option4 = config.option4,
      option5 = config.option5;

  var KEYS = AnalyzerConfig.STORE_KEYS;
  
  // Helper Functions
  function getDefaultState() {
    return {
      completed: true,
      selectedOption: WizardStore.get(KEYS.areaOfInterest) || option3.id,
      previousAreaOfInterest: undefined
    };
  }

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      // Set the default value in the store
      WizardStore.set(KEYS.areaOfInterest, option3.id);
      // Register a callback to the item of interest
      WizardStore.registerCallback(KEYS.areaOfInterest, this.areaOfInterestUpdated);
    },

    areaOfInterestUpdated: function () {
      var selectedOption = WizardStore.get(KEYS.areaOfInterest);
      this.setState({ selectedOption: selectedOption });
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        var defaults = getDefaultState();
        this.replaceState(defaults);
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
      WizardStore.set(KEYS.areaOfInterest, e.target.id);
    },

    _resetSelectedFeatures: function() {
      var previousAreaOfInterest = this.state.previousAreaOfInterest || false,
          currentAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);

      if (previousAreaOfInterest && previousAreaOfInterest !== currentAreaOfInterest) {
        WizardStore.set(KEYS.selectedCustomFeatures, []);
      } else {
        this.setState({previousAreaOfInterest: currentAreaOfInterest});
      }
    },

    _moveOn: function () {
      this._resetSelectedFeatures();
      WizardStore.set(KEYS.userStep, WizardStore.get(KEYS.userStep) + 1);
    }

  });

});
