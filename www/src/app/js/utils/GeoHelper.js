define([
  "map/config",
  "map/Symbols",
	"esri/units",
  "esri/graphic",
  "esri/geometry/Point",
  "esri/geometry/Circle",
  "esri/SpatialReference",
  "esri/tasks/GeometryService",
  "esri/geometry/webMercatorUtils",
  "dojo/Deferred",
  "dojo/_base/array"
], function (MapConfig, Symbols, Units, Graphic, Point, Circle, SpatialReference, GeometryService, webMercatorUtils, Deferred, arrayUtils) {

  var geometryService,
      spatialReference;

	return {

    getSpatialReference: function () {
      return spatialReference = spatialReference || new SpatialReference(102100);
    },

    generatePointGraphicFromGeometric: function (longitude, latitude, attributes) {
      return new Graphic(
        webMercatorUtils.geographicToWebMercator(new Point(longitude, latitude)),
        Symbols.getPointSymbol(),
        attributes
      );
    },

		preparePointAsPolygon: function (pointFeature, radius) {
			var circle = new Circle(new Point(pointFeature.geometry), {
            "radius": radius || 50,
            "radiusUnit": Units.KILOMETERS
          });

      return new Graphic(circle, Symbols.getPolygonSymbol(), pointFeature.attributes);
		},

    applySelectionSymbolToFeature: function (feature) {
      var symbol = feature.geometry.type === 'point' ? 
        Symbols.getHighlightPointSymbol() : 
        Symbols.getHighlightPolygonSymbol();
        
      return new Graphic(feature.geometry, symbol, feature.attributes);
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
      var geometryArray = [],
          newRings = [],
          lngLat,
          point,
          self = this;

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
              point = new Point(ring, self.getSpatialReference());
              lngLat = webMercatorUtils.xyToLngLat(point.x, point.y);
              if (sameCoords(newRings, lngLat)) {
                  newRings.push(lngLat);
                  geometryArray.push(newRings);
                  newRings = [];
              } else {
                  newRings.push(lngLat);
              }
          });
      });

      return {
          geom: geometryArray.length > 1 ? geometryArray : geometryArray[0],
          type: geometryArray.length > 1 ? "MultiPolygon" : "Polygon"
      };
    },

    union: function (polygons) {
      if (Object.prototype.toString.call(polygons) !== '[object Array]') {
        throw new Error('Method expects polygons paramter to be of type Array')
      }

      var deferred = new Deferred(),
          geometryService = geometryService || new GeometryService(MapConfig.geometryServiceUrl);

      if (polygons.length === 1) {
        deferred.resolve(polygons[0]);
      } else {
        geometryService.union(polygons, deferred.resolve, deferred.resolve);
      }
      return deferred;
    }

	};

});
