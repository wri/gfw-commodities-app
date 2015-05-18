define([
  // libs
  'react'
], function (React) {

  var AlertsDialog,
      temp;

  getDefaultState = function () {
    return {};
  }

  AlertsDialog = React.createClass({
    getInitialState: getDefaultState,

    render: function () {
    }
  });

  return function (props, el) {
    return React.renderComponent(new AlertsDialog, document.getElementById(el));
  };
});
