define([
	"react",
  "analysis/config",
  "components/wizard/MillPoint",
  "components/wizard/AdminUnit",
  "components/wizard/CustomArea",
  "components/wizard/CertifiedArea",
  "components/wizard/CommercialEntity"
], function (React, AnalyzerConfig, MillPoint, AdminUnit, CustomArea, CertifiedArea, CommercialEntity) {

  // Variables
  var title = AnalyzerConfig.stepTwo.title,
      // Selection Area Variables
      customArea = AnalyzerConfig.stepTwo.customArea,
      adminUnit = AnalyzerConfig.stepTwo.adminUnit,
      millPoint = AnalyzerConfig.stepTwo.millPoint,
      certArea = AnalyzerConfig.stepTwo.certArea,
      commArea = AnalyzerConfig.stepTwo.commArea;

  // Helper Functions
  function getDefaultState() {
    return {
      completed: false,
      analysisArea: undefined
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

      this.props.updateAnalysisArea = this._updateAnalysisArea;

      return (
        React.DOM.div({'className': 'step'},
          React.DOM.div({'className': 'step-title'}, title),
          React.DOM.div({'className': 's2-tools ' + (this.props.selectedArea !== millPoint ? 'hidden' : '')},
            new MillPoint(this.props)
          ),
          React.DOM.div({'className': 's2-tools ' + (this.props.selectedArea !== adminUnit ? 'hidden' : '')},
            new AdminUnit(this.props)
          ),
          React.DOM.div({'className': 's2-tools ' + (this.props.selectedArea !== customArea ? 'hidden' : '')},
            new CustomArea(this.props)
          ),
          React.DOM.div({'className': 's2-tools ' + (this.props.selectedArea !== certArea ? 'hidden' : '')},
            new CertifiedArea(this.props)
          ),
          React.DOM.div({'className': 's2-tools ' + (this.props.selectedArea !== commArea ? 'hidden' : '')},
            new CommercialEntity(this.props)
          ),
          React.DOM.div({'className': 'selected-analysis-area'},
            React.DOM.span({'className': 'current-selection-label'}, AnalyzerConfig.stepTwo.currentFeatureText),
            React.DOM.span({'className': 'current-selection'}, 
              (this.state.analysisArea ? this.state.analysisArea.attributes.label : "none")
            )
          ),
          React.DOM.div({'className':'next-button-container'},
            React.DOM.span({
              'className': 'next-button ' + (this.state.completed ? '' : 'disabled'), 
              onClick: this._checkRequirements 
            }, "Next")
          )
        )
      );
    },

    _checkRequirements: function () {
      if (this.state.completed) {
        this.props.callback.nextStep();
        this.props.callback.updatePayload("feature", this.state.analysisArea);
      }
    },

    _setCompletion: function (completionStatus) {
      this.setState({
        completed: completionStatus
      });
    },

    _updateAnalysisArea: function (feature) {

      // This function serves dual purpose, essentially a toggle function
      // if feature is defined, this step is considered completed and the anaylsisArea is set
      // Else, reset to default state

      if (feature) {
        this.setState({
          analysisArea: feature,
          completed: true
        });
      } else {
        this.setState(getDefaultState());
      }
    }

  });

});