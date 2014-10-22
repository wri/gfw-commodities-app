// THIS COMPONENT IS A PIECE NECESSARY FOR STEP TWO

define([
	"react"
], function (React) {

	return React.createClass({

    // getInitialState: function () {
    //   return ({
    //     active: this.props.active || false
    //   });
    // },

    componentDidMount: function () {

    },

    render: function () {
      return (
        React.DOM.div({'className': 'mill-point', 'id': 'mill-point'},
          "Coming Soon"
        )
      );
    }

  });

});