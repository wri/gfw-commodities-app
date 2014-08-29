define([
	"react",
  "components/wizard/StepOne",
  "components/wizard/StepTwo",
  "components/wizard/StepThree",
  "components/wizard/StepFour"
], function (React, StepOne, StepTwo, StepThree, StepFour) {

	var breadcrumbs = ["Select Area", "Refine Area", "Select Analysis", "Refine Analysis"];

  function getDefaultState() {
    return {
      currentStep: 0,
      payload: {}
    };
  }


  // This Component has some dynamic properties that get created to trigger refresh on the children or
  // keep track of items that effect some childrens rendering

  var Wizard = React.createClass({

    getInitialState: function () {
      return getDefaultState();
    },

    componentDidMount: function () {

    },

    componentDidUpdate: function () {
      if (this.props.isResetting) {
        // Reset the isResetting property so any future changes dont accidentally trigger a reset
        this.setProps({
          isResetting: false
        });
      }
      console.dir(this.props);
    },

    render: function () {

      var props = this.props;

      props.callback = {
        nextStep: this._nextStep,
        update: this._updateSelectedArea
      };

      return (
        React.DOM.div({'className': 'relative wizard-root'},
          React.DOM.div({'className': 'wizard-header'},
            React.DOM.span({'className': 'title'}, "Analysis"),
            React.DOM.span({'className': 'reset button', onClick: this._reset }, "Reset"),
            React.DOM.span({'className': 'fullscreen button'}, "Full screen"),
            React.DOM.div({'className': 'breadcrumbs'},
              breadcrumbs.map(this._breadcrumbMapper, this)
            )
          ),
          React.DOM.div({'className': 'wizard-body'},
            React.DOM.div({'className': this.state.currentStep !== 0 ? 'hidden' : ''},
              new StepOne(props)
            ),
            React.DOM.div({'className': this.state.currentStep !== 1 ? 'hidden' : ''},
              new StepTwo(props)
            ),
            React.DOM.div({'className': this.state.currentStep !== 2 ? 'hidden' : ''},
              new StepThree(props)
            ),
            React.DOM.div({'className': this.state.currentStep !== 3 ? 'hidden' : ''},
              new StepFour(props)
            )
          )
        )
      );
    },

    _breadcrumbMapper: function (item, index) {
      var className = index < this.state.currentStep ? 'enabled': ''; 
      className  += this.state.currentStep === index ? ' active' : '';

      return React.DOM.span({'className': className},
        React.DOM.span({'className': 'piece', 'data-index': index, onClick: this._changeStep}, item),
        (index < breadcrumbs.length -1) ? React.DOM.span({'className': 'carat'}, ' > ') : null
      );
    },


    // UI Functions that affect internal properties only
    _changeStep: function (synEvent) {
      var targetIndex = synEvent.target.dataset ? synEvent.target.dataset.index : synEvent.target.getAttribtue("data-index");
      if (targetIndex < this.state.currentStep) {
        this.setState({
          currentStep: (1 * targetIndex) // Convert to Int
        });
      }
    },

    _nextStep: function () {
      this.setState({
        currentStep: this.state.currentStep + 1
      });
    },

    _reset: function () {
      // Call setProps to trigger reset on children
      this.setProps({
        isResetting: true
      });
      // Reset this components state
      this.replaceState(getDefaultState());
    },

    _updateSelectedArea: function (value) {
      this.setProps({
        selectedArea: value
      });
    }

  });

	return function (props, el) {
		return React.renderComponent(new Wizard(props), document.getElementById(el));
	};

});