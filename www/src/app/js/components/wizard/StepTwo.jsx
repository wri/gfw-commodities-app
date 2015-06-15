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
      // This may require newest react to use spread attributes
      // return (
      //   <div className='step'>
      //     <div className='step-body'>
      //       <div className='step-title'>{title + ' - ' + customTitles[selectedArea]}</div>
      //       <div className={'s2-tools ' + (selectedArea !== millPoint ? 'hidden' : '')}>
      //         <MillPoint {...this.props} />
      //       </div>
      //       <div className={'s2-tools ' + (selectedArea !== adminUnit ? 'hidden' : '')}>
      //         <AdminUnit {...this.props} />
      //       </div>
      //       <div className={'s2-tools ' + (selectedArea !== customArea ? 'hidden' : '')}>
      //         <CustomArea {...this.props} />
      //       </div>
      //       <div className={'s2-tools ' + (selectedArea !== certArea ? 'hidden' : '')}>
      //         <CertifiedArea {...this.props} />
      //       </div>
      //       <div className={'s2-tools ' + (selectedArea !== commArea ? 'hidden' : '')}>
      //         <CommercialEntity {...this.props} />
      //       </div>
      //     </div>
      //     <div className='step-footer'>
      //       <div className='selected-analysis-area'>
      //         <div className='current-selection-label'>{AnalyzerConfig.stepTwo.currentFeatureText}</div>
      //         <div className='current-selection' title={this.state.currentSelectionLabel}>{this.state.currentSelectionLabel}</div>
      //       </div>
      //       <div onClick={this.checkRequirements} className={'next-button-container ' + (this.state.completed ? '' : 'disabled')}>
      //         <span className='next-button'>Next</span>
      //       </div>
      //     </div>
      //   </div>
      // );
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
    /* jshint ignore:end */

    checkRequirements: function () {
      if (this.state.completed) {
        WizardActions.proceedToNextStep();
        // WizardStore.set(KEYS.userStep, WizardStore.get(KEYS.userStep) + 1);
      }
    }
    
  });

});
