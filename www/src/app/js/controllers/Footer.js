define([
    'dojo/query',
    'dojo/dom',
    'dojo/dom-style'
], function(dojoQuery, dom, domStyle) {

    var initialized = false;

    return {

        init: function(template) {

            if (initialized) { return; }

            initialized = true;

            // This is most likely the culprit for why gfw-assets must be loaded in the footer after this content
            // is injected
            dom.byId('app-footer').innerHTML = template + dom.byId('app-footer').innerHTML;

            // Inject Header and Footer from GFW, This must be loaded here
            // until the architecture gets cleaned up or else things break
            var s = document.createElement('script'),
                h = document.getElementsByTagName('head')[0];

            s.src = 'http://gfw-assets.s3.amazonaws.com/static/gfw-assets.nightly.js';
            // s.src = 'http://gfw-assets.s3.amazonaws.com/static/gfw-assets.latest.js';

            s.async = true;
            s.setAttribute('id', 'loader-gfw'); // this is very important
            s.setAttribute('data-current', '.shape-commodities'); // fire"s" the "s" is necessary
            s.setAttribute('data-google', true);
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
