/** @jsx React.DOM */
define([
	"react",
  "analysis/config",
  "analysis/WizardStore",
  "actions/WizardActions",
  "components/wizard/MillPoint",
  "components/wizard/AdminUnit",
  "components/wizard/CustomArea",
  "components/wizard/CertifiedArea",
  "components/wizard/CommercialEntity"
], function (React, AnalyzerConfig, WizardStore, WizardActions, MillPoint, AdminUnit, CustomArea, CertifiedArea, CommercialEntity) {
  // Variables
  var title = AnalyzerConfig.stepTwo.title,
      // Selection Area Variables
      customArea = AnalyzerConfig.stepTwo.customArea,
      adminUnit = AnalyzerConfig.stepTwo.adminUnit,
      millPoint = AnalyzerConfig.stepTwo.millPoint,
      certArea = AnalyzerConfig.stepTwo.certArea,
      commArea = AnalyzerConfig.stepTwo.commArea,
      labelField = AnalyzerConfig.stepTwo.labelField,
      customTitles = {};

  var KEYS = AnalyzerConfig.STORE_KEYS;

  customTitles[customArea] = 'Create a custom area';
  customTitles[adminUnit] = 'Administrative unit';
  customTitles[millPoint] = 'Mill point';
  customTitles[certArea] = 'Certified area';
  customTitles[commArea] = 'Commercial entity';

  // Helper Functions
  function getDefaultState() {
    return {
      completed: false,
      currentSelectionLabel: getCurrentSelectionLabel()
    };
  }

  function getCurrentSelectionLabel () {
    var currentFeatures = WizardStore.get(KEYS.selectedCustomFeatures);
    return (currentFeatures.length > 0 ? currentFeatures.map(function (feature) {return feature.attributes.WRI_label;}).join(',') : 'none');
  }

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      WizardStore.registerCallback(KEYS.selectedCustomFeatures, this.analysisAreaUpdated);
    },

    analysisAreaUpdated: function () {
      var currentFeatures = WizardStore.get(KEYS.selectedCustomFeatures);

      if (currentFeatures.length > 0) {
        this.setState({
          completed: true,
          currentSelectionLabel: getCurrentSelectionLabel()
        });
      } else {
        this.replaceState(getDefaultState());
      }
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(getDefaultState());
      }
    },

    /* jshint ignore:start */
    render: function () {
      var selectedArea = WizardStore.get(KEYS.areaOfInterest);
      return (
        React.createElement("div", {className: "step"},
          React.createElement("div", {className: "step-body"},
            React.createElement("div", {className: "step-title"}, title + ' - ' + customTitles[selectedArea]),
            React.createElement("div", {className: 's2-tools ' + (selectedArea !== millPoint ? 'hidden' : '')},
              React.createElement(MillPoint, React.__spread({},  this.props))
            ),
            React.createElement("div", {className: 's2-tools ' + (selectedArea !== adminUnit ? 'hidden' : '')},
              React.createElement(AdminUnit, React.__spread({},  this.props))
            ),
            React.createElement("div", {className: 's2-tools ' + (selectedArea !== customArea ? 'hidden' : '')},
              React.createElement(CustomArea, React.__spread({},  this.props))
            ),
            React.createElement("div", {className: 's2-tools ' + (selectedArea !== certArea ? 'hidden' : '')},
              React.createElement(CertifiedArea, React.__spread({},  this.props))
            ),
            React.createElement("div", {className: 's2-tools ' + (selectedArea !== commArea ? 'hidden' : '')},
              React.createElement(CommercialEntity, React.__spread({},  this.props))
            )
          ),
          React.createElement("div", {className: "step-footer"},
            React.createElement("div", {className: "selected-analysis-area"},
              React.createElement("div", {className: "current-selection-label"}, AnalyzerConfig.stepTwo.currentFeatureText),
              React.createElement("div", {className: "current-selection", title: this.state.currentSelectionLabel}, this.state.currentSelectionLabel)
            ),
            React.createElement("div", {onClick: this.checkRequirements, className: 'next-button-container ' + (this.state.completed ? '' : 'disabled')},
              React.createElement("span", {className: "next-button"}, "Next")
            )
          )
        )
      );
    },
    /* jshint ignore:end */

    checkRequirements: function () {
      if (this.state.completed) {
        WizardActions.proceedToNextStep();
      }
    }

  });

});
