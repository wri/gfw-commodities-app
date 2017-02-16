define([
	'react',
	'components/ModalWrapper',
  'dojo/dom-class'
], function (React, ModalWrapper, domClass) {


  var CalendarWrapper = React.createClass({displayName: "CalendarWrapper",

    close:function () {
      var node = React.findDOMNode(this).parentElement;
      domClass.add(node, 'hidden');
    },

    render: function() {
      return (
        React.createElement("div", {className: "modal-container"}, 
        React.createElement("div", {className: "calendar-background", onClick: this.close}), 
        React.createElement("div", {className: "calendar-window"}, 
          React.createElement("div", {title: "close", className: "modal-close close-icon pointer", onClick: this.close}, 
						React.createElement("svg", {viewBox: "0 0 25 25"}, 
              React.createElement("path", {d: "M 5 19 L 19 5 L 21 7 L 7 21 L 5 19 ZM 7 5 L 21 19 L 19 21 L 5 7 L 7 5 Z"})
            )
          ), 
          React.createElement("div", {className: "calendar-wrapper custom-scroll"}, 
            this.props.children
          )
        )
      )
      );

    }
  });

  return CalendarWrapper;

});
