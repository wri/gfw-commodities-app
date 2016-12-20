define([
	"dojo/Deferred",
	"esri/tasks/QueryTask",
    "esri/tasks/query",
    "esri/tasks/ImageServiceIdentifyTask",
    "esri/tasks/ImageServiceIdentifyParameters",
    "esri/tasks/StatisticDefinition",
    "esri/request",
    "esri/tasks/AreasAndLengthsParameters",
    "esri/tasks/GeometryService",
    "esri/SpatialReference",
    "esri/tasks/ProjectParameters",
    "esri/tasks/BufferParameters"
	// "core/config",
 //    "core/toolkitController",
 //    "core/modelSaveController"
],
function(
    Deferred,
	QueryTask,
    Query,
    ImageServiceIdentifyTask,
    ImageServiceIdentifyParameters,
    StatisticDefinition,
    esriRequest,
    AreasAndLengthsParameters,
    GeometryService,
    SpatialReference,
    ProjectParameters,
    BufferParameters
) {

    var o = {};

    var obj_to_esriParams = function(esriParamTarget, obj){
        for (param in obj){
            if (obj.hasOwnProperty(param)){
                if (obj[param]){
                    esriParamTarget[param] = obj[param];
                }
            }
        }

        return esriParamTarget
    }

    var getGeometryUnits = function(params){
        params.lengthUnit = GeometryService[params.lengthUnit];
        params.areaUnit = GeometryService[params.areaUnit];
        return params;
    }



    var execute_task = function(task,params,execution){
        var deferred = new Deferred();

        execution = execution || 'execute';

        task[execution](params, function(results){
            deferred.resolve(results);
        },
        function(err){
            deferred.resolve(err);
        });
        return deferred;
    }

    o.getAreasLengths = function(url,params){
        var deferred = new Deferred();
        params = getGeometryUnits(params);
        var al_params = obj_to_esriParams(new AreasAndLengthsParameters(),params);
        var geometryService = new GeometryService(url);
        geometryService.areasAndLengths(al_params).then(function(results){
            deferred.resolve(results);
        })
        return deferred
    }

    o.project = function(url,params,outWkid){
        var deferred = new Deferred();
        params.outSR = new SpatialReference(outWkid)
        var geometryService = new GeometryService(url);

        var projParams = obj_to_esriParams(new ProjectParameters(),params);
        geometryService.project(projParams).then(function(results){
            deferred.resolve(results);
        });
        return deferred
    }

    o.buffer = function(url,params,wkid){
        var deferred = new Deferred();
        var bufferParams = obj_to_esriParams(new BufferParameters(),params);
        bufferParams.unit = GeometryService[params.unit];
        bufferParams.spatialReference = params.geometries[0].spatialReference;
        bufferParams.outSpatialReference = new SpatialReference(wkid);
        var geometryService = new GeometryService(url);
        geometryService.buffer(bufferParams).then(function(results){
            deferred.resolve(results);
        });
        return deferred
    }

    o.loadServiceInfo = function(url){
        var deferred = new Deferred();
        var layersRequest = esri.request({
          url: url,
          content: { f: "json" },
          handleAs: "json"
        });
        layersRequest.then(
          function(response) {
            console.log("Success: ", response.layers);
            deferred.resolve(response);
        }, function(error) {
            console.log("Error: ", error.message);
            deferred.resolve(error);

        });

        return deferred;
    }

    o.queryForStats = function(url, params, statdefs){
        //Create StatisticDefinition object for a query,
        //then query layer
        var deferred = new Deferred();
        var statDefArray = statdefs.map(function(def){
            return obj_to_esriParams(new StatisticDefinition(),def);
        })
        params.outStatistics = statDefArray;
        return o.queryEsri(url, params)

    }

    o.queryEsri = function(url, params, execution) {
    	var queryTask = new QueryTask(url);
        var query = obj_to_esriParams(new Query(), params);

    	var deferred = execute_task(queryTask,query,execution);
        return deferred
    };



    o.computeHistogram = function(url, content) {
            return esriRequest({
                url: url + '/computeHistograms',
                content: content,
                handleAs: 'json',
                callbackParamName: 'callback',
                timeout: 60000
            }, {
                usePost: true
            });
    };


    o.queryJson = function() {



    };

    return o;
});
