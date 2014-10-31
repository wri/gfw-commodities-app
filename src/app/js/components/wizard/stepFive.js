define([
    "react",
    "analysis/config"
], function(React, AnalyzerConfig) {

    // Variables
    var config = AnalyzerConfig.stepFive;

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
            return (
                React.DOM.div({'className': 'step'},
                    React.DOM.div({'className': 'step-body'},
                        React.DOM.div({'className': 'step-title'}, config.title),
                        React.DOM.div({'className': 'step-one-main-description'}, 
                            React.DOM.p({}, config.beginningText),
                            React.DOM.ul({},
                                config.firstList.map(this._listMapper)
                            ),
                            React.DOM.p({}, config.secondaryText),
                            React.DOM.ul({},
                                config.secondList.map(this._listMapper)
                            ),
                            config.finalDivs.map(this._paragraphMapper)
                        )
                    ),
                    React.DOM.div({'className': 'step-footer'},
                        React.DOM.div({'className': 'next-button-container',onClick: this._moveOn},
                            React.DOM.span({'className': 'next-button'}, "Next")
                        )
                    )
                )
            );
        },

        _listMapper: function (item) {
            return React.DOM.li({}, item);
        },

        _paragraphMapper: function (item) {
            return React.DOM.p({}, item);
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