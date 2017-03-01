/** @jsx React.DOM */
define([
  'react',
  'dojo/dom-class'
], function (React, domClass) {

  var ModalWrapper = React.createClass({displayName: "ModalWrapper",

    close:function () {
      var node = React.findDOMNode(this).parentElement;
      domClass.add(node, 'hidden');
    },

    /* jshint ignore:start */
    render: function() {
      return (
        React.createElement("div", {className: "modal-container"}, 
        React.createElement("div", {className: "modal-background", onClick: this.close}), 
        React.createElement("div", {className: "modal-window"}, 
          React.createElement("div", {title: "close", className: "modal-close close-icon pointer", onClick: this.close}, 
            React.createElement("svg", {viewBox: "0 0 25 25"}, 
              React.createElement("path", {d: "M 5 19 L 19 5 L 21 7 L 7 21 L 5 19 ZM 7 5 L 21 19 L 19 21 L 5 7 L 7 5 Z"})
            )
          ), 
          React.createElement("div", {className: ("modal-wrapper custom-scroll " + ((this.props.children && this.props.children[0]) || !this.props.downloadData ? '' : 'has-footer'))}, 
            this.props.children, 
            (this.props.children && this.props.children[0]) || !this.props.downloadData ? null :
              React.createElement("div", {className: "modal-footer"}, 
                React.createElement("div", {className: "m-btncontainer is-center"}, 
                  React.createElement("a", {href: this.props.downloadData, onClick: this.sendDownloadAnalytics, target: "_blank", className: "btn green uppercase download-mobile-link"}, "Learn more or download data")
                )
              )
            
          )
        )
      )
      );

    }

  });

  return ModalWrapper;

});
