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
            s.src = 'https://cdn.rawgit.com/simbiotica/gfw_assets/ce0f8ab8893f30aa99160536a9cc212e5bd5753b/src/header-loader.js';
            s.async = true;
            // Highlight current icon on load
            s.onload = s.onreadystatechange = function () {
              var icon,
                  intervalID = setInterval(function () {
                    icon = dojoQuery('#headerGfw .shape-commodities')[0];
                    if (icon !== undefined) {
                      domClass.add(icon, 'current');
                      clearInterval(intervalID);
                    }
                  }, 50);
            };
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
