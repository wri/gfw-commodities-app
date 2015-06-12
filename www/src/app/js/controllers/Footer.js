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

            // This is most likely the culprit for why gfw-assets must be loaded in the footer after this content
            // is injected
            dom.byId("app-footer").innerHTML = template + dom.byId("app-footer").innerHTML;

            // Inject Header and Footer from GFW, This must be loaded here
            // until the architecture gets cleaned up or else things break
            var s = document.createElement('script'),
                h = document.getElementsByTagName('head')[0];
            s.src = 'http://www.globalforestwatch.org/gfw-assets';
            s.async = true;
            h.appendChild(s);
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
