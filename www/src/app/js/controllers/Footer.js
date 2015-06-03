define([
    "dojo/dom",
    "dojo/dom-style",
    "models/FooterModel"
], function(dom, domStyle, FooterModel) {
    'use strict';

    var initialized = false;

    return {

        init: function(template) {

            if (initialized) { return; }

            initialized = true;
            dom.byId("app-footer").innerHTML = template + dom.byId("app-footer").innerHTML;

        },

        toggle: function(hide) {
            if (hide) {
                domStyle.set('app-footer', 'display', 'none');
            } else {
                domStyle.set('app-footer', 'display', 'block');
            }
        }

    };

});
