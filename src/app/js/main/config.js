define({

    "title": "Global Forest Watch Commodities",

    "urls": {
        "gfw": "http://www.globalforestwatch.org/",
        "blog": "http://blog.globalforestwatch.org/tag/commodities/",
        "fires": "http://fires.globalforestwatch.org/#v=home",
        "SPOTT": "http://www.sustainablepalmoil.org/spott/"


    },

    "corsEnabledServers": [
        "https://api-ssl.bitly.com",
        "http://globalforestwatch.org",
        "http://firms.modaps.eosdis.nasa.gov",
        "http://gis-potico.wri.org",
        "http://gfw-apis.appspot.com",
        "http://50.18.182.188"
    ],

    "homeModeOptions": [{
        "html": "<span class='less-text'>Explore the map</span>",
        "eventName": "goToMap",
        "display": true,
        "id": 0,
        "tooltip": "Explore the Map"
    }, {
        "html": "<span>Check out GFW Fires</span>",
        "eventName": "goToFires",
        "display": false,
        "id": 1,
        "tooltip": "Check out GFW Fires"
    }, {
        "html": "Read recent blogs and news about GFW Commodities",
        "eventName": "goToBlogs",
        "display": false,
        "id": 2,
        "tooltip": "Commodities News & Blogs"
    }, {
        "html": "Check out ZSL's Transparency Toolkit",
        "eventName": "goToZSL",
        "display": false,
        "id": 3,
        "tooltip": "ZSL Transparency Toolkit"
    }],

    "homeDialog": {
        "html":
            "<p>GFW Commodities is constantly undergoing site enhancements including interface redesigns based on user feedback and the incorporation of new datasets and new tools you asked for.</p>" +
            "<p>If you'd like to be kept informed of these kinds of updates, please <a href='http://www.wri.org/stay-informed-about-global-forest-watch-commodities' target='_blank'>join our mailing list</a>.</p>" +
            "<p>We will <strong>NEVER</strong> sell your email address to anyone, ever. We will only use your email address to send you useful newsletters about updates to the site or request your user feedback. You can unsubscribe at any time.</p>"
    }

});