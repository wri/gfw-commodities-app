define([
	"esri/Color",
	"esri/units",
  "esri/graphic",
  "esri/geometry/Circle",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol"
], function (Color, Units, Graphic, Circle, SimpleLineSymbol, SimpleFillSymbol) {

	return {

		preparePointAsPolygon: function (pointFeature) {
			var longitude = pointFeature.attributes.Longitude,
          latitude = pointFeature.attributes.Latitude,
          circleSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                     		 new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0]), 2),
                     		 new Color([255, 200, 103, 0.65])),
          circle = new Circle([longitude, latitude], {
            "radius": 50,
            "radiusUnit": Units.KILOMETERS
          });

      return new Graphic(circle, circleSymbol, pointFeature.attributes);
		}

	};

});