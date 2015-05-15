define([
	'esri/Color',
	'esri/symbols/SimpleFillSymbol',
  'esri/symbols/SimpleLineSymbol',
  'esri/symbols/SimpleMarkerSymbol'
], function (Color, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol) {
	'use strict';

	var Symbols = {

		/**
		* Polygon Symbol Used for Custom Drawn Polygons or Uploaded Polygons
		*/
		getPolygonSymbol: function () {
			return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,0,0]), 2),
        new Color([103,200,255,0.0]));
		},

		/**
		* Point Symbol Used for Uploaded Points
		*/
		getPointSymbol: function () {
			return new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
    		new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([255,0,0]), 1),
    		new Color([0,0,0,0.25]));
		},

		/**
    * Cyan Colored Polygon Symbol for Highlighted or Active Features
    */
		getHighlightPolygonSymbol: function () {
      return new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,255,255]), 2),
        new Color([103,200,255,0.0]));
		},

    /**
    * Cyan Colored Point Symbol for Highlighted or Active Features
    */
    getHighlightPointSymbol: function () {
      return new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0,255,255]), 1),
        new Color([0,0,0,0.25]));
    }

	};

	return Symbols;

});
