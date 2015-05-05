define([
    "react",
    "analysis/config",
    "analysis/WizardStore"
], function(React, AnalyzerConfig, WizardStore) {

    // Variables
    var config = AnalyzerConfig.stepFive;
    var KEYS = AnalyzerConfig.STORE_KEYS;

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
                            )
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

        _moveOn: function() {
            var currentStep = WizardStore.get(KEYS.userStep) + 1;
            WizardStore.set(KEYS.userStep, WizardStore.get(KEYS.userStep) + 1);
        }

    });

});