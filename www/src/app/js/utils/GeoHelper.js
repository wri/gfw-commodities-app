define([
  "map/config",
  "map/Symbols",
	"esri/units",
  "esri/graphic",
  "esri/geometry/Point",
  "esri/geometry/Circle",
  "esri/SpatialReference",
  "esri/geometry/webMercatorUtils"
], function (MapConfig, Symbols, Units, Graphic, Point, Circle, SpatialReference, webMercatorUtils) {

	return {

		preparePointAsPolygon: function (pointFeature, radius) {
			var longitude = pointFeature.attributes.Longitude,
          latitude = pointFeature.attributes.Latitude,
          circle = new Circle(new Point(pointFeature.geometry), {
            "radius": radius || 50,
            "radiusUnit": Units.KILOMETERS
          });

      return new Graphic(circle, Symbols.getPolygonSymbol(), pointFeature.attributes);
		},

    applySelectionSymbolToFeature: function (feature) {
      return new Graphic(feature.geometry, Symbols.getPolygonSymbol(), feature.attributes);
    },

    zoomToFeature: function (feature) {
      if (feature.geometry.x) {
        app.map.centerAndZoom(feature.geometry, 9);
      } else if (feature.geometry.center) {
        app.map.centerAndZoom(feature.geometry.center, 9);
      } else {
        app.map.setExtent(feature.geometry.getExtent(), true);
      }
    },

    /**
    * Return the next highest unique id, using WRI_ID as the unique id field
    */
    nextCustomFeatureId: function () {
      var graphicsLayer = app.map.getLayer(MapConfig.customGraphicsLayer.id),
          graphics = graphicsLayer.graphics,
          length = graphics.length,
          next = 0,
          index,
          temp;

      for (index = 0; index < length; index++) {
        temp = parseInt(graphics[index].attributes.WRI_ID);
        if (!isNaN(temp)) {
          next = Math.max(next, temp);
        }
      }
      return (next + 1);
    },

    convertGeometryToGeometric: function(geometry) {
      var sr = new SpatialReference({wkid: 102100}),
          geometryArray = [],
          newRings = [],
          geo,
          pt;

      // Helper function to determine if the coordinate is already in the array
      // This signifies the completion of a ring and means I need to reset the newRings
      // and start adding coordinates to the new newRings array
      function sameCoords(arr, coords) {
          var result = false;
          arrayUtils.forEach(arr, function(item) {
              if (item[0] === coords[0] && item[1] === coords[1]) {
                  result = true;
              }
          });
          return result;
      }

      arrayUtils.forEach(geometry.rings, function(ringers) {
          arrayUtils.forEach(ringers, function(ring) {
              pt = new Point(ring, sr);
              geo = webMercatorUtils.xyToLngLat(pt.x, pt.y);
              if (sameCoords(newRings, geo)) {
                  newRings.push(geo);
                  geometryArray.push(newRings);
                  newRings = [];
              } else {
                  newRings.push(geo);
              }
          });
      });

      return {
          geom: geometryArray.length > 1 ? geometryArray : geometryArray[0],
          type: geometryArray.length > 1 ? "MultiPolygon" : "Polygon"
      };
    }

    // TODO: Generator union from .prepareForAnalysis

	};

});
