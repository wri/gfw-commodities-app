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
    var cacheArray = [];
    var KEYS = AnalyzerConfig.STORE_KEYS;

    function getDefaultCheckedState() {
      return config.checkboxes.filter(function(item) {
        return item.checked;
      }).map(function(item) {
        return item.value;
      }).concat([config.forestChange.value]);
    }

    function getCurrentSelectionLabel () {
      var currentFeatures = WizardStore.get(KEYS.selectedCustomFeatures);
      return (currentFeatures.length > 0 ? currentFeatures.map(function (feature) {return feature.attributes.WRI_label; }).join(',') : 'none');
    }

    /* Helper Functions */
    function getDefaultState() {
      return {
        completed: false,
        optionsExpanded: true,
        forestChangeCategory: true,
        forestChangeCheckbox: getDefaultCheckedState(),
        currentSelectionLabel: getCurrentSelectionLabel()
      };
    }

    return React.createClass({

      getInitialState: function() {
        return getDefaultState();
      },

      componentDidMount: function () {
        WizardStore.registerCallback(KEYS.selectedCustomFeatures, this.analysisAreaUpdated);
        WizardStore.registerCallback(KEYS.areaOfInterest, this.AOIupdated);
        // WizardStore.registerCallback(KEYS.forestChangeCheckbox, this.checkboxesUpdated);
        // WizardStore.set(KEYS.forestChangeCheckbox, this.state.forestChangeCheckbox);
      },

      AOIupdated: function () {
        var aoi = WizardStore.get(KEYS.areaOfInterest);
        var checkedValues = this.state.forestChangeCheckbox.slice();
        config.checkboxes.some(function(checkbox) {
          if (aoi === checkbox.label && checkedValues.indexOf(checkbox.value) === -1) {
            checkedValues.push(checkbox.value);
            this.setState({forestChangeCheckbox: checkedValues});
            return true;
          }
        }, this);
      },

      analysisAreaUpdated: function () {
        this.setState({ currentSelectionLabel: getCurrentSelectionLabel() });
      },

      toggleOptions: function () { //todo: toggle these open (or not) on analysis via popup!
        this.setState({ optionsExpanded: !this.state.optionsExpanded });
      },

      // checkboxesUpdated: function () { //todo: toggle these open (or not) on analysis via popup!
      //   // var analysisArea = WizardStore.get(KEYS.selectedCustomFeatures);
      //   this.setState({ forestChangeCheckbox: WizardStore.get(KEYS.forestChangeCheckbox) });
      // },

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

      // resetForestChange: function() {
      //   this.setState({forestChangeCheckbox: getDefaultCheckedState()});
      // },

      /* jshint ignore:start */
      render: function() {
        var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
        var selectedFeatures = WizardStore.get(KEYS.selectedCustomFeatures);

        var optionsExpanded = this.state.optionsExpanded;
        var checkedValues = this.state.forestChangeCheckbox;
        var hasPoints = selectedFeatures.length > 0 && selectedFeatures.some(function (feature) {
          return feature.geometry.type === 'point';
        });

        //<span onClick={this.toggleOptions} className={`analysis-expander ${this.state.optionsExpanded ? 'open' : 'closed'}`}></span>
        return (
          React.createElement("div", {className: "step select-analysis"}, 
            React.createElement("div", {className: "step-body"}, 
              React.createElement("div", {className: "step-three-top"}, 
                React.createElement("div", {className: "step-title"}, config.title), 
                /* Show this Only If Mill Point Analysis is Being Done */
                
                  selectedAreaOfInterest === config.millPoint || selectedAreaOfInterest === config.customArea ?
                    this.createPointContent(hasPoints) :
                    null, 
                
                React.createElement("div", {className: "relative forestChange-description"}, 
                  React.createElement(WizardCheckbox, {onClick: this.toggleOptions, value: config.forestChange.value, checked: checkedValues.indexOf(config.forestChange.value) > -1, change: this._selectionMade, isResetting: this.props.isResetting, label: config.forestChange.label, noInfoIcon: true}), 
                  React.createElement("svg", {onClick: this.toggleOptions, className: ("analysis-expander " + (optionsExpanded ? 'open' : 'closed')), dangerouslySetInnerHTML: { __html: optionsExpanded ? treeOpen : treeClosed}}), 
                  React.createElement("p", {className: "forest-options-text layer-description"}, "Choose layers here")
                ), 
                React.createElement("p", {className: "layer-description"}, config.forestChange.description), 
                React.createElement("div", {className: ("checkbox-list " + (optionsExpanded === false ? 'transition-hidden' : ''))}, 
                  React.createElement("div", null, 
                    config.checkboxes.map(this._mapper, this)
                  )
                ), 

                React.createElement(WizardCheckbox, {label: config.suit.label, value: config.suit.value, checked: checkedValues.indexOf(config.suit.value) > -1, change: this._selectionMade, isResetting: this.props.isResetting, noInfoIcon: true}), 
                React.createElement("p", {className: "layer-description"}, config.suit.description), 
                React.createElement(WizardCheckbox, {label: config.rspo.label, value: config.rspo.value, checked: checkedValues.indexOf(config.rspo.value) > -1, change: this._selectionMade, isResetting: this.props.isResetting, noInfoIcon: true}), 
                React.createElement("p", {className: "layer-description"}, config.rspo.description), 
                React.createElement("div", {className: selectedAreaOfInterest === 'millPointOption' || selectedAreaOfInterest === 'commercialEntityOption' ? '' : 'hidden', 
                  style: { 'position': 'relative'}
                }, 
                  React.createElement(WizardCheckbox, {label: config.mill.label, value: config.mill.value, checked: checkedValues.indexOf(config.mill.value) > -1, change: this._selectionMade, isResetting: this.props.isResetting, noInfoIcon: true}), 
                  React.createElement("p", {className: "layer-description"}, config.mill.description)
                ), 
                React.createElement("p", {className: "layer-description palm-risk"}, React.createElement("a", {href: "http://www.wri.org/publication/palmriskmethodology", target: "_blank"}, "Click here"), " to see the PALM Risk Assessment Methodology technical note")
              )
            ), 
            React.createElement("div", {className: "step-footer"}, 
              React.createElement("div", {className: "selected-analysis-area"}, 
                React.createElement("div", {className: "current-selection-label"}, AnalyzerConfig.stepTwo.currentFeatureText), 
                React.createElement("div", {className: "current-selection", title: this.state.currentSelectionLabel}, this.state.currentSelectionLabel)
              ), 
              React.createElement("div", {onClick: this._proceed, className: 'next-button-container ' + (this.state.completed ? '' : 'disabled')}, 
                React.createElement("span", {className: "next-button"}, "Perform Analysis")
              )
            )
          )
        );
      },

      _mapper: function(item) {
        var checkedValues = this.state.forestChangeCheckbox;

        return React.createElement(WizardCheckbox, {
          label: item.label, 
          value: item.value, 
          change: this._selectionMade, 
          childLabel: item.childLabel, 
          childChecked: checkedValues.indexOf(item.childValue) > -1, 
          childChange: this._selectionMade, 
          childValue: item.childValue, 
          isResetting: this.props.isResetting, // Pass Down so Components receive the reset command
          checked: checkedValues.indexOf(item.value) > -1, 
          noInfoIcon: item.noInfoIcon || false}
        );
      },

      createPointContent: function (hasPoints) {

        var isCustomArea = WizardStore.get(KEYS.areaOfInterest) === config.customArea;

        var options = config.pointRadiusOptions.map(function (option) {
          return React.createElement("option", {value: option.value}, option.label);
        });

        // If it has points, render a select to choose a buffer radius
        // If it does not have points but it is custom features, user used Create Custom Area and
        // is analyzing polygons, so show nothing, otherwise, show little description

        return (!hasPoints && isCustomArea ? null : React.createElement("p", {className: "sub-title"}, config.knownMillsDisclaimer));

      },

      /* jshint ignore:end */

      _selectionMade: function(checkboxValue) {
        var a = this.state.forestChangeCheckbox.slice();

        if(checkboxValue && checkboxValue === config.forestChange.value) {
          this.toggleFca(a.indexOf(checkboxValue) > -1);
        } else if(checkboxValue){
          var index = a.indexOf(checkboxValue);

          if(index > -1) {
            a.splice(index, 1);
          } else {
            a.push(checkboxValue);
          }
          this.setState({forestChangeCheckbox: a});
        }

        var completed = this._checkRequirements();
        var oldCompleted = this.state.completed;
        if (oldCompleted !== completed) {
          this.setState({ completed: completed });
        }
      },

      toggleFca: function(currentChecked) {
        var checkedValues = this.state.forestChangeCheckbox.slice();
        if(!currentChecked){
          checkedValues = checkedValues.concat(cacheArray);
          checkedValues.push(config.forestChange.value);
        } else {
          cacheArray = [];
          config.checkboxes.forEach(function(item) {
            if(checkedValues.indexOf(item.value) > -1) {
              cacheArray.push(item.value);
            }
          });
          cacheArray.forEach(function(value) {
            checkedValues.splice(checkedValues.indexOf(value), 1);
          });
          checkedValues.splice(checkedValues.indexOf(config.forestChange.value), 1);
        }
        this.setState({forestChangeCheckbox: checkedValues});
      },

      checkedOverride: function(itemLabel) {
        var selectedAreaOfInterest = WizardStore.get(KEYS.areaOfInterest);
        // var selectedFeatures = WizardStore.get(KEYS.selectedCustomFeatures);
        if (selectedAreaOfInterest === itemLabel) {
          return true;
        } else {
          return false;
        }
      },

      _checkRequirements: function() {
        var result = false,
          nodes = $('.select-analysis .wizard-checkbox.active');

        // Conditions
        // At least One item must be checked
        // If more than one item is checked, we pass
        if (nodes && nodes.length > 0) {
          result = true;
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
          // var pointRadiusSelect = this.refs.pointRadiusSelect;
          // if (pointRadiusSelect) {
          //   var radius = pointRadiusSelect.getDOMNode().value;
          //   WizardStore.set(KEYS.analysisPointRadius, radius);
          // }
          this.props.callback.performAnalysis();
          //- Send off analytics for Commercial Entity If they picked that.
        }
      }
    });

});
