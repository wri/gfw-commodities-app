define({

    "title": "Global Forest Watch Commodities",

    "urls": {
        "gfw": "http://www.globalforestwatch.org/",
        "blog": "http://blog.globalforestwatch.org/tag/commodities/",
        "fires": "http://fires.globalforestwatch.org/#v=home",
        "SPOTT": "http://www.sustainablepalmoil.org/toolkit/"


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
        "html": "<span class='less-text'>Explore the map</span>",
        "eventName": "goToMap",
        "display": true,
        "id": 2,
        "tooltip": "Explore the Map"
    }, {
        "html": "Read recent blogs and news about GFW Commodities",
        "eventName": "goToBlogs",
        "display": false,
        "id": 3,
        "tooltip": "Commodities News & Blogs"
    }, {
        "html": "Check out the SPOTT tool created by ZSL",
        "eventName": "goToZSL",
        "display": false,
        "id": 4,
        "tooltip": "Check out the SPOTT tool"
    }]

});