define([
    "dojo/dom",
    "dojo/dom-style",
    "models/FooterModel"
], function(dom, domStyle, FooterModel) {
    'use strict';

    var initialized = false;

    return {

        init: function(template) {

            if (initialized) {
                return;
            }

            initialized = true;
            //debugger;
            dom.byId("app-footer").innerHTML = template + dom.byId("app-footer").innerHTML;
            //dom.byId(viewId).innerHTML = html + dom.byId(viewId).innerHTML;

            setTimeout(function () {
                var s = document.createElement('script'),
                h = document.getElementsByTagName('body')[0];
                s.setAttribute('src', "https://cdn.rawgit.com/simbiotica/gfw_assets/a1c6c10126d915e4198a7adf707adb266443f3e4/src/header-loader.js");
                s.setAttribute('id', "loader-gfw");
                s.setAttribute('data-current', ".shape-commodities");
                //s.setAttribute('async', 'true');
                h.appendChild(s);

            }, 0);


            // $('#footer-logos').slick({
            //     infinite: true,
            //     slidesToShow: 5,
            //     slidesToScroll: 5,
            //     speed: 500,
            //     autoplay: true,
            //     autoplaySpeed: 3000
            // });

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