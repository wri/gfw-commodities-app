define([
    "dojo/query",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/dom-class",
    "models/FooterModel"
], function(dojoQuery, dom, domStyle, domClass, FooterModel) {
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

            // latest
            // s.src = 'http://globalforestwatch.org/gfw-assets';

            //test
            s.src = 'https://cdn.rawgit.com/simbiotica/gfw_assets/3862c199249e4acc7407c4c9ba615d0a20025a61/js/build/production.js';

            s.async = true;
            s.setAttribute('id', "loader-gfw"); // this is very important
            s.setAttribute('data-current', ".shape-commodities"); // fire"s" the "s" is necessary
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
