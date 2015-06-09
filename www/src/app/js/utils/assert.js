define([], function () {
  'use strict';

  /**
  * Simple assertion function to validate some condition or throw an error
  * @param condition {boolean} This condition is an expression that must evaluate to a boolean
  */
  return function (condition, message) {
    if (condition) return;
    throw new Error(['Assertion Error:', message].join(' '));
  };

});
