/** @jsx React.DOM */
define([
	'react',
  'analysis/config',
	'utils/Analytics',
  'analysis/WizardStore',
  'actions/WizardActions'
], function (React, AnalyzerConfig, Analytics, WizardStore, WizardActions) {

  // Variables
  var config = AnalyzerConfig.stepOne,
      option1 = config.option1,
      option2 = config.option2,
      option3 = config.option3,
      option4 = config.option4,
      option5 = config.option5,
      KEYS = AnalyzerConfig.STORE_KEYS;

  // Helper Functions
  function getDefaultState() {

    return {
      completed: true,
      selectedOption: WizardStore.get(KEYS.areaOfInterest) || option1.id,
      previousAreaOfInterest: undefined
    };
  }

	function getAOILabel (aoi) {
		switch (aoi) {
			case option1.id:
				return option1.label;
			case option2.id:
				return option2.label;
			case option3.id:
				return option3.label;
			case option4.id:
				return option4.label;
			case option5.id:
				return option5.label;
		}
	}

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      // Set the default value in the store
			var aoi = WizardStore.get(KEYS.areaOfInterest);

			if (!aoi) {
				WizardActions.setAreaOfInterest(option1.id);
			}
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

    /* jshint ignore:start */
    render: function () {
			var inlineStyle = {
        color: '#888',
				margin: '10px',
        paddingRight: '5px'
      };

			var inlineP = {
				fontSize: '13px',
				marginTop: '0px',
				marginBottom: '0px'
			};
      return (
        React.createElement("div", {className: "step"},
          React.createElement("div", {className: "step-body"},
            React.createElement("div", {className: "step-title"}, config.title),
            React.createElement("p", {className: "step-one-main-description"}, config.description),
            React.createElement("div", {className: "s1-radio-container"},
              React.createElement("input", {type: "radio", name: "first-step", onChange: this.changeSelection, id: option1.id, checked: this.state.selectedOption === option1.id}),
              React.createElement("label", {htmlFor: option1.id}, option1.label),
              React.createElement("p", {className: "step-one-option-description"}, option1.description)
            ),
            React.createElement("div", {className: "s1-radio-container"},
              React.createElement("input", {type: "radio", name: "first-step", onChange: this.changeSelection, id: option2.id, checked: this.state.selectedOption === option2.id}),
              React.createElement("label", {htmlFor: option2.id}, option2.label),
              React.createElement("p", {className: "step-one-option-description"}, option2.description)
            ),
            React.createElement("div", {className: "s1-radio-container"},
              React.createElement("input", {type: "radio", name: "first-step", onChange: this.changeSelection, id: option3.id, checked: this.state.selectedOption === option3.id}),
              React.createElement("label", {htmlFor: option3.id}, option3.label),
              React.createElement("p", {className: "step-one-option-description"}, option3.description)
            ),
            React.createElement("div", {className: "s1-radio-container"},
              React.createElement("input", {type: "radio", name: "first-step", onChange: this.changeSelection, id: option4.id, checked: this.state.selectedOption === option4.id}),
              React.createElement("label", {htmlFor: option4.id}, option4.label),
              React.createElement("p", {className: "step-one-option-description"}, option4.description)
            ),
						React.createElement("div", {style: inlineStyle},
							React.createElement("h4", null, "PALM RISK ANALYSIS"),
							React.createElement("p", {style: inlineP}, "Analyze palm oil mill locations by visiting"),
							React.createElement("p", {style: inlineP}, React.createElement("a", {target: "_blank", href: "http://pro.globalforestwatch.org/"}, "pro.globalforestwatch.org"), " and requesting an account")
						)
          ),
          React.createElement("div", {className: "step-footer"},
            React.createElement("div", {className: "next-button-container", onClick: this.proceed},
              React.createElement("span", {className: "next-button"}, "Next")
            )
          )
        )
      );
    },
    /* jshint ignore:end */

    changeSelection: function (e) {
      WizardActions.setAreaOfInterest(e.target.id);
    },

    resetSelectedFeatures: function() {
      var previousAreaOfInterest = this.state.previousAreaOfInterest || false,
          currentAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);

      if (previousAreaOfInterest && previousAreaOfInterest !== currentAreaOfInterest) {
        WizardActions.clearSelectedCustomFeatures();
      } else {
        this.setState({previousAreaOfInterest: currentAreaOfInterest});
      }
    },

    proceed: function () {
      this.resetSelectedFeatures();
      WizardActions.proceedToNextStep();
			//- Send Analytics
			var aoi = WizardStore.get(KEYS.areaOfInterest);
			Analytics.sendEvent('Analysis', 'Area', getAOILabel(aoi));
    }

  });

});
