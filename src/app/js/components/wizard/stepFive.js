define([
    "react",
    "analysis/config"
], function(React, AnalyzerConfig) {

    // Variables
    var config = AnalyzerConfig.stepFive,
        title = config.title,
        description = config.description;

    // Helper Functions
    function getDefaultState() {
        return {
            completed: true
        };
    }

    return React.createClass({

        getInitialState: function() {
            return getDefaultState();
        },

        componentDidMount: function() {
            this.props.callback.update(getDefaultState().selectedOption);
        },

        componentWillReceiveProps: function(newProps) {
            if (newProps.isResetting) {
                var defaults = getDefaultState();
                this.replaceState(defaults);
                this.props.callback.update(defaults.selectedOption);
            } else if (newProps.selectedArea) {
                this.setState({
                    selectedOption: newProps.selectedArea
                });
            }
        },

        render: function() {
            // $(".breadcrumbs").hide();
            return (
                React.DOM.div({
                        'className': 'step'
                    },
                    React.DOM.div({
                            'className': 'step-body'
                        },
                        React.DOM.div({
                            'className': 'step-title'
                        }, title),
                        React.DOM.p({
                            'className': 'step-one-main-description'
                        }, description)

                    ),
                    React.DOM.div({
                            'className': 'step-footer'
                        },
                        React.DOM.div({
                                'className': 'next-button-container',
                                onClick: this._moveOn
                            },
                            React.DOM.span({
                                'className': 'next-button'
                            }, "Next")
                        )
                    )
                )
            );
        },

        _changeSelection: function(e) {
            // this.setState({
            //   selectedOption: e.target.id
            // });
            this.props.callback.update(e.target.id);
        },

        _moveOn: function() {
            this.props.callback.nextStep();
        }

    });

});