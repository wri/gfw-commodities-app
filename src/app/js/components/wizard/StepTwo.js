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
      commArea = AnalyzerConfig.stepTwo.commArea,
      labelField = AnalyzerConfig.stepTwo.labelField;

  // Helper Functions
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
        return;
      }

      if (newProps.analysisArea) {
        this.setState({
          completed: true
        });
      } else {
        this.replaceState(getDefaultState());
      }
    },

    render: function () {

      var currentSelection = (this.props.analysisArea ? 
          (this.props.analysisArea.attributes ? this.props.analysisArea.attributes[labelField] : this.props.optionalLabel)
          : "none");

      var currentSelectionClass = 'current-selection ' + (currentSelection.length > 35 ? 'big-name' : '');

      return (
        React.DOM.div({'className': 'step'},
          React.DOM.div({'className': 'step-body'},
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
            )
          ),
          React.DOM.div({'className': 'step-footer'},
            React.DOM.div({'className': 'selected-analysis-area'},
              React.DOM.div({'className': 'current-selection-label'}, AnalyzerConfig.stepTwo.currentFeatureText),
              React.DOM.div({'className': currentSelectionClass}, 
                currentSelection
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
        this.props.callback.nextStep();
      }
    },

    _setCompletion: function (completionStatus) {
      this.setState({
        completed: completionStatus
      });
    }

  });

});