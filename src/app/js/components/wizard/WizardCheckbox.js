define([
    "react",
    "components/Check",
    "dojo/topic"
], function(React, Check, topic) {

    return React.createClass({

        // EXPERIMENTAL TO SEE HOW IT WORKS
        // DEFINE REQUIRED PROPERTIES HERE (LIKE SPECIFIYNG WHICH PARAMETERS AER REQUIRED IN CLASS INSTANTIATION)
        propTypes: {
            label: React.PropTypes.string.isRequired,
            value: React.PropTypes.string.isRequired
        },

        getInitialState: function() {
            return {
                active: this.props.defaultChecked || false
            };
        },

        componentWillReceiveProps: function(newProps) {
            if (newProps.isResetting) {
                this.replaceState(this.getInitialState());
            }
        },

        componentDidUpdate: function(prevProps, prevState) {
            if (this.props.change && (prevState.active !== this.state.active)) {
                this.props.change(this.state.active);
            }
        },

        render: function() {

            var className = 'wizard-checkbox' + (this.state.active ? ' active' : '');

            return (
                React.DOM.div({
                        'className': 'wizard-checkbox-container'
                    },
                    React.DOM.div({
                            'className': className,

                            'data-value': this.props.value
                        },
                        React.DOM.span({
                                'className': 'custom-check',
                                'onClick': this._toggle
                            },
                            React.DOM.span({})
                        ),
                        React.DOM.a({
                            'className': 'wizard-checkbox-label',
                            'onClick': this._toggle
                        }, this.props.label),
                        React.DOM.div({
                            'className': 'layer-info-icon',
                            'onClick': this.showInfo
                            //'onClick': Check.showInfo
                        })
                    )
                )
            );
        },

        _toggle: function() {
            console.log(this);
            this.setState({
                active: !this.state.active
            });
        },

        showInfo: function(synEvent) {
            console.log(synEvent);
            if (document.getElementsByClassName(this.props.infoDivClass).length) {
                console.log(this.props.infoDivClass);
                topic.publish('showInfoPanel', document.getElementsByClassName(this.props.infoDivClass)[0]);
            } else {
                console.log(this);
                console.log(this.props.infoDivClass);
                topic.publish('showInfoPanel', this.props.infoDivClass);
            }

        }

    });

});