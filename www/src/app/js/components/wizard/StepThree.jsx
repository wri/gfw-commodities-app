/** @jsx React.DOM */
define([
    "react",
    "analysis/config",
    "analysis/WizardStore",
    "components/wizard/WizardCheckbox"
], function (React, AnalyzerConfig, WizardStore, WizardCheckbox) {

    var config = AnalyzerConfig.stepThree,
        labelField = AnalyzerConfig.stepTwo.labelField;

    var KEYS = AnalyzerConfig.STORE_KEYS;

    /* Helper Functions */
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

        getInitialState: function() {
            return getDefaultState();
        },

        componentDidMount: function () {
            WizardStore.registerCallback(KEYS.selectedCustomFeatures, this.analysisAreaUpdated);
        },

        analysisAreaUpdated: function () {
            var analysisArea = WizardStore.get(KEYS.selectedCustomFeatures);
            this.setState({ currentSelectionLabel: getCurrentSelectionLabel() });
        },

        componentDidUpdate: function (prevProps) {
            var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
            var currentStep = WizardStore.get(KEYS.userStep);

            if (selectedAreaOfInterest !== 'millPointOption' && 
                     prevProps.currentStep === 2 &&
                     currentStep === 3) {
                // Recheck requirements and update state if necessary
                this._selectionMade();
            }
        },

        componentWillReceiveProps: function(newProps) {
            if (newProps.isResetting) {
                this.replaceState(getDefaultState());
            }
        },

        shouldComponentUpdate: function () {
          // Should Only Rerender if we are on this step, dont rerender if this is not visible
          return WizardStore.get(KEYS.userStep) === 3;
        },

        /* jshint ignore:start */
        render: function() {
            var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
            var selectedFeatures = WizardStore.get(KEYS.selectedCustomFeatures);
            var arePoints = selectedFeatures.length > 0 && selectedFeatures.every(function (feature) {
              return feature.geometry.type === 'point';
            });

            return (
              <div className='step select-analysis'>
                <div className='step-body'>
                  <div className='step-three-top'>
                    <div className='step-title'>{config.title}</div>
                    {/* Show this Only If Mill Point Analysis is Being Done */}
                    {
                      selectedAreaOfInterest === 'millPointOption' ?
                        (arePoints ? this.createSelect() : <p className='sub-title'>(Analysis based on 50km buffer)</p>) :
                        null 
                    }
                    <WizardCheckbox label={config.suit.label} value={config.suit.value} change={this._selectionMade} isResetting={this.props.isResetting} noInfoIcon={true} />
                    <p className='layer-description'>{config.suit.description}</p>
                    <WizardCheckbox label={config.rspo.label} value={config.rspo.value} change={this._selectionMade} isResetting={this.props.isResetting} noInfoIcon={true} />
                    <p className='layer-description'>{config.rspo.description}</p>
                    <div className={selectedAreaOfInterest === 'millPointOption' ? '' : 'hidden'}
                      style={{ 'position': 'relative' }}
                    >
                      <div className='coming-soon'>Mill Point Risk Assessment Coming Soon!</div>
                      <WizardCheckbox label={config.mill.label} value={config.mill.value} change={this._selectionMade} isResetting={this.props.isResetting} noInfoIcon={true} />
                      <p className='layer-description'>{config.mill.description}</p>
                    </div>
                    <div className='step-sub-header'>{config.forestChange.label}</div>
                    <p className='layer-description'>{config.forestChange.description}</p>
                  </div>

                  <div className='checkbox-list'>{config.checkboxes.map(this._mapper, this)}</div>

                </div>
                <div className='step-footer'>
                  <div className='selected-analysis-area'>
                    <div className='current-selection-label'>{AnalyzerConfig.stepTwo.currentFeatureText}</div>
                    <div className='current-selection' title={this.state.currentSelectionLabel}>{this.state.currentSelectionLabel}</div>
                  </div>
                  <div onClick={this._proceed} className={'next-button-container ' + (this.state.completed ? '' : 'disabled')}>
                    <span className='next-button'>Perform Analysis</span>
                  </div>
                </div>
              </div>
            );
        },

        _mapper: function(item) {
            return <WizardCheckbox label={item.label} value={item.value} change={this._selectionMade}
                isResetting={this.props.isResetting} // Pass Down so Components receive the reset command
                defaultChecked={item.checked || false} noInfoIcon={item.noInfoIcon || false}
            />;
        },

        createSelect: function () {
          return <select className='mill-radius-select'>
            <option>50Km</option>
            <option>40Km</option>
            <option>30Km</option>
            <option>20Km</option>
            <option>10Km</option>
          </select>;
        },

        /* jshint ignore:end */

        _selectionMade: function(checked) {

            var completed = this._checkRequirements();

            if (completed) {
                var payload = this._getPayload();
                WizardStore.set(KEYS.analysisSets, payload);
            }

            this.setState({ completed: completed });

        },

        _checkRequirements: function() {
            var result = false,
                nodes = document.querySelectorAll(".select-analysis .wizard-checkbox.active"),
                selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest),
                value;

            // Conditions
            // At least One item must be checked
            // If more than one item is checked, we pass
            if (nodes.length > 0) {
                if (nodes.length > 1) {
                    result = true;
                } else {
                    // nodes === 1
                    value = nodes[0].dataset ? nodes[0].dataset.value : nodes[0].getAttribute('data-value');
                    if (selectedAreaOfInterest !== 'millPointOption' && value === 'mill') {
                        // This Fails, result is already false so do nothing
                    } else {
                        result = true;
                    }
                }
            }

            return result;
        },

        _getPayload: function() {
            var nodes = document.querySelectorAll(".select-analysis .wizard-checkbox"),
                selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest),
                payload = {},
                self = this,
                value;

            Array.prototype.forEach.call(nodes, function(node) {
                value = node.dataset ? node.dataset.value : node.getAttribute('data-value');
                if (selectedAreaOfInterest !== 'millPointOption' && value === 'mill') {
                    // Dont add mills unless millPointOption is the selectedArea
                } else {
                    payload[value] = (node.className.search('active') > -1);
                }
            });

            return payload;
        },

        _proceed: function() {
            if (this.state.completed) {
                this.props.callback.performAnalysis();
            }
        }


    });

});
