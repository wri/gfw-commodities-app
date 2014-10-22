define([
    "react",

    "dojo/topic"
], function(React, topic) {

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
            switch (this.props.value) {
                case "peat":
                    this.props.infoDivClass = "forest-and-land-cover-peat-lands";
                    break;
                case "treeDensity":
                    this.props.infoDivClass = "forest-and-land-cover-tree-cover-density"
                    break;
                case "legal":
                    this.props.infoDivClass = "forest-and-land-cover-legal-classifications"
                    break;
                case "protected":
                    this.props.infoDivClass = "conservation-protected-areas"
                    break;
                case "carbon":
                    this.props.infoDivClass = "forest-and-land-cover-carbon-stocks"
                    break;
                case "intact":
                    this.props.infoDivClass = "forest-and-land-cover-intact-forest-landscape"
                    break;
                case "landCoverGlob":
                    this.props.infoDivClass = "forest-and-land-cover-land-cover-global"
                    break;
                case "primForest":
                    this.props.infoDivClass = "suitability-suitability-mapper"
                    break;
                case "suit":
                    this.props.infoDivClass = "land-use-oil-palm"
                    console.log("are we here?");
                    break;
            }

            if (document.getElementsByClassName(this.props.infoDivClass).length) {
                console.log(this.props.infoDivClass);
                topic.publish('showInfoPanel', document.getElementsByClassName(this.props.infoDivClass)[0]);
            } else {
                console.log(this.props.value);
                topic.publish('showInfoPanel', this.props.infoDivClass);
            }

        }

    });

});