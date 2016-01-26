/** @jsx React.DOM */
define([
  "react"
], function (React) {

  // Variables
  var closeSvg = '<use xlink:href="#shape-close" />';

  var ModalWrapper = React.createClass({displayName: "ModalWrapper",

    /* jshint ignore:start */
    render: function() {
      return (
        React.createElement("div", {className: "modal-container"}, 
        React.createElement("div", {className: "modal-background", onClick: this.close}), 
        React.createElement("article", {className: "modal shadow"}, 
          React.createElement("div", {title: "close", className: "close-icon pointer", onClick: this.close}, 
            React.createElement("svg", {dangerouslySetInnerHTML: { __html: closeSvg}})
          ), 
            React.createElement("div", {className: "modal-content custom-scroll"}, 
              this.props.children
            )
        )
      )
      );

    }

  });

  // return function (props, el) {
  //   /* jshint ignore:start */
  //   return React.render(<ModalWrapper />, document.getElementById(el));
  //   /* jshint ignore:end */
  // };
  return ModalWrapper;

});
