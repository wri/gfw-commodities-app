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
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2),
        new Color([103, 200, 255, 0.0]));
		},

		/**
		* Point Symbol Used for Uploaded Points
		*/
		getPointSymbol: function () {
			return new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
    		new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([255,0,0]), 1),
    		new Color([0,0,0, 0.5]));
		},

		// May Not Be Needed, Will Implement if Needed, Probably will use getPolygonSymbol
		getCircleSymbol: function () {

		}

	};

	return Symbols;

});