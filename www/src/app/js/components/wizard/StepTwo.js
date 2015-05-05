define([
	"react",
  "analysis/config",
  "analysis/WizardStore",
  "components/wizard/MillPoint",
  "components/wizard/AdminUnit",
  "components/wizard/CustomArea",
  "components/wizard/CertifiedArea",
  "components/wizard/CommercialEntity"
], function (React, AnalyzerConfig, WizardStore, MillPoint, AdminUnit, CustomArea, CertifiedArea, CommercialEntity) {  
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
    var analysisArea = WizardStore.get(KEYS.analysisArea);
    var optionalLabel = WizardStore.get(KEYS.optionalAnalysisLabel);

    return (analysisArea ? 
      (analysisArea.attributes ? analysisArea.attributes[labelField] : optionalLabel)
      : "none"
    );
  }

	return React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {
      WizardStore.registerCallback(KEYS.analysisArea, this.analysisAreaUpdated);
    },

    analysisAreaUpdated: function () {
      var analysisArea = WizardStore.get(KEYS.analysisArea);
      
      if (analysisArea) {
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

    render: function () {

      var selectedArea = WizardStore.get(KEYS.areaOfInterest);

      return (
        React.DOM.div({'className': 'step'},
          React.DOM.div({'className': 'step-body'},
            React.DOM.div({'className': 'step-title'}, title + ' - ' + customTitles[selectedArea]),
            React.DOM.div({'className': 's2-tools ' + (selectedArea !== millPoint ? 'hidden' : '')},
              new MillPoint(this.props)
            ),
            React.DOM.div({'className': 's2-tools ' + (selectedArea !== adminUnit ? 'hidden' : '')},
              new AdminUnit(this.props)
            ),
            React.DOM.div({'className': 's2-tools ' + (selectedArea !== customArea ? 'hidden' : '')},
              new CustomArea(this.props)
            ),
            React.DOM.div({'className': 's2-tools ' + (selectedArea !== certArea ? 'hidden' : '')},
              new CertifiedArea(this.props)
            ),
            React.DOM.div({'className': 's2-tools ' + (selectedArea !== commArea ? 'hidden' : '')},
              new CommercialEntity(this.props)
            )
          ),
          React.DOM.div({'className': 'step-footer'},
            React.DOM.div({'className': 'selected-analysis-area'},
              React.DOM.div({'className': 'current-selection-label'}, AnalyzerConfig.stepTwo.currentFeatureText),
              React.DOM.div({'className': 'current-selection','title': this.state.currentSelectionLabel }, 
                this.state.currentSelectionLabel
              )
            ),
            React.DOM.div({'className':'next-button-container ' + (this.state.completed ? '' : 'disabled'), 
                            onClick: this._checkRequirements},
              React.DOM.span({'className': 'next-button' }, "Next")
            )
          )
        )
      );
    },

    _checkRequirements: function () {
      if (this.state.completed) {
        WizardStore.set(KEYS.userStep, WizardStore.get(KEYS.userStep) + 1);
      }
    },

    _setCompletion: function (completionStatus) {
      this.setState({ completed: completionStatus });
    }

  });

});