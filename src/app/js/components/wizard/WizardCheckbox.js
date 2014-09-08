define([
  "react"
], function (React) {

  return React.createClass({

    getInitialState: function () {
      return {
        active: this.props.defaultChecked || false
      };
    },

    componentWillReceiveProps: function (newProps) {
      if (newProps.isResetting) {
        this.replaceState(this.getInitialState());
      }
    },

    componentDidUpdate: function (prevProps, prevState) {
      if (this.props.change && (prevState.active !== this.state.active)) {
        this.props.change(this.state.active);
      }
    },

    render: function () {

      var className = 'wizard-checkbox' + (this.state.active ? ' active' : '');

      return (
        React.DOM.div({'className': 'wizard-checkbox-container'},
          React.DOM.div({'className': className, 'onClick': this._toggle, 'data-value': this.props.value},
            React.DOM.span({'className': 'custom-check'},
              React.DOM.span({})
            ),
            React.DOM.a({'className': 'wizard-checkbox-label'}, this.props.label)
          )
        )
      );
    },

    _toggle: function () {
      this.setState({
        active: !this.state.active
      });
    }

  });

});