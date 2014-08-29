// THIS COMPONENT IS A PIECE NECESSARY FOR STEP TWO

define([
	"react",
  "analysis/config"
], function (React, AnalyzerConfig) {

  var drawingInstructions = AnalyzerConfig.customArea.instructions;      

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
        React.DOM.div({'className': 'custom-area'},
          React.DOM.p({'className': 'drawing-instructions'}, drawingInstructions),
          React.DOM.div({'className': 'drawing-tools'},
            React.DOM.div({'className': 'drawing-tool-button'}, AnalyzerConfig.customArea.polyLabel),
            React.DOM.div({'className': 'drawing-tool-button'}, AnalyzerConfig.customArea.freehandLabel),
            React.DOM.div({'className': 'drawing-tool-button'}, AnalyzerConfig.customArea.uploadLabel)
          )
        )
      );
    }

  });

});