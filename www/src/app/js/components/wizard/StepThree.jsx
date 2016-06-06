/** @jsx React.DOM */
define([
    'react',
    'analysis/config',
    'analysis/WizardStore',
    'components/wizard/WizardCheckbox'
], function (React, AnalyzerConfig, WizardStore, WizardCheckbox) {

    var config = AnalyzerConfig.stepThree;
    var treeClosed = '<use xlink:href="#tree-closed" />';
    var treeOpen = '<use xlink:href="#tree-open" />';
    // labelField = AnalyzerConfig.stepTwo.labelField;

    var KEYS = AnalyzerConfig.STORE_KEYS;

    function getCurrentSelectionLabel () {
      var currentFeatures = WizardStore.get(KEYS.selectedCustomFeatures);
      return (currentFeatures.length > 0 ? currentFeatures.map(function (feature) {return feature.attributes.WRI_label;}).join(',') : 'none');
    }

    /* Helper Functions */
    function getDefaultState() {
      return {
        completed: false,
        optionsExpanded: false,
        currentSelectionLabel: getCurrentSelectionLabel()
      };
    }

    return React.createClass({

      getInitialState: function() {
        return getDefaultState();
      },

      componentDidMount: function () {
        WizardStore.registerCallback(KEYS.selectedCustomFeatures, this.analysisAreaUpdated);
      },

      analysisAreaUpdated: function () {
        // var analysisArea = WizardStore.get(KEYS.selectedCustomFeatures);
        this.setState({ currentSelectionLabel: getCurrentSelectionLabel() });
      },

      toggleOptions: function () { //todo: toggle these open (or not) on analysis via popup!
        // var analysisArea = WizardStore.get(KEYS.selectedCustomFeatures);
        this.setState({ optionsExpanded: !this.state.optionsExpanded });
      },

      componentDidUpdate: function () {
        // var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
        var currentStep = WizardStore.get(KEYS.userStep);

        // if (selectedAreaOfInterest !== 'millPointOption' &&
        if (currentStep === 3) {
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
        var hasPoints = selectedFeatures.length > 0 && selectedFeatures.some(function (feature) {
          return feature.geometry.type === 'point';
        });

        //<span onClick={this.toggleOptions} className={`analysis-expander ${this.state.optionsExpanded ? 'open' : 'closed'}`}></span>
        return (
          <div className='step select-analysis'>
            <div className='step-body'>
              <div className='step-three-top'>
                <div className='step-title'>{config.title}</div>
                {/* Show this Only If Mill Point Analysis is Being Done */}
                {
                  selectedAreaOfInterest === config.millPoint || selectedAreaOfInterest === config.customArea ?
                    this.createPointContent(hasPoints) :
                    null
                }
                <WizardCheckbox label={config.suit.label} value={config.suit.value} change={this._selectionMade} isResetting={this.props.isResetting} noInfoIcon={true} />
                <p className='layer-description'>{config.suit.description}</p>
                <WizardCheckbox label={config.rspo.label} value={config.rspo.value} change={this._selectionMade} isResetting={this.props.isResetting} noInfoIcon={true} />
                <p className='layer-description'>{config.rspo.description}</p>
                <div className={selectedAreaOfInterest === 'millPointOption' || selectedAreaOfInterest === 'commercialEntityOption' ? '' : 'hidden'}
                  style={{ 'position': 'relative' }}
                >
                <WizardCheckbox label={config.mill.label} value={config.mill.value} change={this._selectionMade} isResetting={this.props.isResetting} noInfoIcon={true} />
                <p className='layer-description'>{config.mill.description}</p>

                </div>
                <div className='step-sub-header'>
                <span onClick={this.toggleOptions} className={`forestChange-description ${this.state.optionsExpanded ? 'open' : 'closed'}`}>{config.forestChange.label}</span>

                {
                  this.state.optionsExpanded === true ? <svg onClick={this.toggleOptions} className={`analysis-expander ${this.state.optionsExpanded ? 'open' : 'closed'}`} dangerouslySetInnerHTML={{ __html: treeOpen }}/> :
                  <svg onClick={this.toggleOptions} className={`analysis-expander ${this.state.optionsExpanded ? 'open' : 'closed'}`} dangerouslySetInnerHTML={{ __html: treeClosed }}/>
                }
                </div>
                <p className='layer-description'>{config.forestChange.description}</p>
              </div>

              <div className={`checkbox-list ${this.state.optionsExpanded === false ? 'transition-hidden' : ''}`}>{config.checkboxes.map(this._mapper, this)}</div>

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
        var checkedFromPopup = this.checkedOverride(item.label);

        return <WizardCheckbox label={item.label} value={item.value} checkedFromPopup={checkedFromPopup} change={this._selectionMade}
          isResetting={this.props.isResetting} // Pass Down so Components receive the reset command
          defaultChecked={item.checked || false} noInfoIcon={item.noInfoIcon || false}
        />;
      },

      createPointContent: function (hasPoints) {

        var isCustomArea = WizardStore.get(KEYS.areaOfInterest) === config.customArea;

        var options = config.pointRadiusOptions.map(function (option) {
          return <option value={option.value}>{option.label}</option>;
        });

        // If it has points, render a select to choose a buffer radius
        // If it does not have points but it is custom features, user used Create Custom Area and
        // is analyzing polygons, so show nothing, otherwise, show little description

        return (hasPoints ?
          <div className='point-radius-select-container'>
              <span className='instructions'>{config.pointRadiusDescription}</span>
              <select ref='pointRadiusSelect' className='point-radius-select'>{options}</select>
          </div> :
            isCustomArea ? null : <p className='sub-title'>{config.knownMillsDisclaimer}</p>
        );
      },

      /* jshint ignore:end */

      _selectionMade: function() {
        var completed = this._checkRequirements();

        let oldCompleted = this.state.completed;
        if (oldCompleted !== completed) {
          this.setState({ completed: completed });
        }
      },

      checkedOverride: function(itemLabel) {
        var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
        console.log(selectedAreaOfInterest);
        // var selectedFeatures = WizardStore.get(KEYS.selectedCustomFeatures);
        if (selectedAreaOfInterest === itemLabel) {
          return true;
        } else {
          return false;
        }
      },

      _checkRequirements: function() {
        var result = false,
          nodes = document.querySelectorAll('.select-analysis .wizard-checkbox.active');
          // selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest),
          // value;

        // Conditions
        // At least One item must be checked
        // If more than one item is checked, we pass
        if (nodes.length > 0) {
          // if (nodes.length > 1) {
          result = true;
          // } else {
          //     // nodes === 1
          //     value = nodes[0].dataset ? nodes[0].dataset.value : nodes[0].getAttribute('data-value');
          //     // if (selectedAreaOfInterest !== 'millPointOption' && value === 'mill') {
          //     //     // This Fails, result is already false so do nothing
          //     // } else {
          //         result = true;
          //     // }
          // } // millPoint is back in as a viable Analysis Layer, hence the check removal
        }

        return result;
      },

      _getPayload: function() {
        var nodes = document.querySelectorAll('.select-analysis .wizard-checkbox'),
          selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest),
          payload = {},
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
          var payload = this._getPayload();
          WizardStore.set(KEYS.analysisSets, payload);
          // Get the Radius and set it to the store if it exists
          var pointRadiusSelect = this.refs.pointRadiusSelect;
          if (pointRadiusSelect) {
            var radius = pointRadiusSelect.getDOMNode().value;
            WizardStore.set(KEYS.analysisPointRadius, radius);
          }
          this.props.callback.performAnalysis();
        }
      }
    });

});
