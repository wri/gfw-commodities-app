define([
    "react",
    "analysis/config",
    "components/wizard/WizardCheckbox"
], function(React, AnalyzerConfig, WizardCheckbox) {

    var config = AnalyzerConfig.stepThree,
        labelField = AnalyzerConfig.stepTwo.labelField;

    function getDefaultState() {
        return {
            completed: false
        };
    }

    return React.createClass({

        getInitialState: function() {
            return getDefaultState();
        },

        componentDidMount: function() {

        },

        componentWillReceiveProps: function(newProps) {
            if (newProps.isResetting) {
                this.replaceState(getDefaultState());
            }

            if (newProps.selectedArea !== 'millPointOption' && 
                     this.props.currentStep === 2 &&
                     newProps.currentStep === 3) {
                // Recheck requirements and update state if necessary
                this._selectionMade();
            }
        },

        render: function() {

            var currentSelection = (this.props.analysisArea ?
                (this.props.analysisArea.attributes ? this.props.analysisArea.attributes[labelField] : this.props.optionalLabel) : "none");            

            return (

                React.DOM.div({
                        'className': 'step select-analysis'
                    },
                    React.DOM.div({
                            'className': 'step-body'
                        },
                        React.DOM.div({
                                'className': 'step-three-top'
                            },
                            React.DOM.div({
                                'className': 'step-title'
                            }, config.title),
                            (   this.props.selectedArea === 'millPointOption' ?
                                React.DOM.p({'className': 'sub-title'}, "(Analysis based on 50km buffer)") :
                                null
                            ),
                            new WizardCheckbox({
                                'label': config.suit.label,
                                'value': config.suit.value,
                                'change': this._selectionMade,
                                'isResetting': this.props.isResetting
                            }),
                            React.DOM.p({
                                'className': 'layer-description'
                            }, config.suit.description),
                            new WizardCheckbox({
                                'label': config.rspo.label,
                                'value': config.rspo.value,
                                'change': this._selectionMade,
                                'isResetting': this.props.isResetting

                            }),
                            React.DOM.p({
                                'className': 'layer-description'
                            }, config.rspo.description),
                            React.DOM.div({'className': (this.props.selectedArea === 'millPointOption' ? '' : 'hidden')},
                                new WizardCheckbox({
                                    'label': config.mill.label,
                                    'value': config.mill.value,
                                    'change': this._selectionMade,
                                    'isResetting': this.props.isResetting
                                }),
                                React.DOM.p({
                                    'className': 'layer-description'
                                }, config.mill.description)
                            ),
                            React.DOM.div({
                                'className': 'step-sub-header'
                            }, config.forestChange.label),
                            React.DOM.p({
                                'className': 'layer-description'
                            }, config.forestChange.description)
                        ),
                        React.DOM.div({
                                'className': 'checkbox-list'
                            },
                            config.checkboxes.map(this._mapper, this)
                        )
                    ),
                    React.DOM.div({
                            'className': 'step-footer'
                        },
                        React.DOM.div({
                                'className': 'selected-analysis-area'
                            },
                            React.DOM.div({
                                'className': 'current-selection-label'
                            }, AnalyzerConfig.stepTwo.currentFeatureText),
                            React.DOM.div({
                                    'className': 'current-selection',
                                    'title': currentSelection
                                },
                                currentSelection
                            )
                        ),
                        React.DOM.div({
                                'className': 'next-button-container ' + (this.state.completed ? '' : 'disabled')
                            },
                            React.DOM.span({
                                'className': 'next-button',
                                'onClick': this._proceed
                            }, "Perform Analysis")
                        )
                    )
                )
            );
        },

        _mapper: function(item) {
            return new WizardCheckbox({
                'label': item.label,
                'value': item.value,
                'change': this._selectionMade,
                'isResetting': this.props.isResetting, // Pass Down so Components receive the reset command
                'defaultChecked': item.checked || false
            });
            // React.DOM.span({
            //     'className': 'layer-info-icon',
            //     'onClick': Check.showInfo
            // });
        },

        _selectionMade: function(checked) {

            var completed = this._checkRequirements();

            if (completed) {
                var payload = this._getPayload();
                this.props.callback.updateAnalysisDatasets(payload);
            }

            this.setState({
                completed: completed
            });

        },

        _checkRequirements: function() {
            var result = false,
                nodes = document.querySelectorAll(".select-analysis .wizard-checkbox.active"),
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
                    if (this.props.selectedArea !== 'millPointOption' && value === 'mill') {
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
                payload = {},
                self = this,
                value;

            Array.prototype.forEach.call(nodes, function(node) {
                value = node.dataset ? node.dataset.value : node.getAttribute('data-value');
                if (self.props.selectedArea !== 'millPointOption' && value === 'mill') {
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