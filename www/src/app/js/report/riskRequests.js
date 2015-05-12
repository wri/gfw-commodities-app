define([
	"dojo/Deferred",
	"esri/tasks/QueryTask", 
  "esri/tasks/query", 
  "esri/tasks/ImageServiceIdentifyTask",
  "esri/tasks/ImageServiceIdentifyParameters", 
  "esri/tasks/StatisticDefinition",
  "esri/request"
], function (Deferred,QueryTask, Query, ImageServiceIdentifyTask, ImageServiceIdentifyParameters, StatisticDefinition, esriRequest) {

    var o = {};

    var obj_to_esriParams = function(esriParamTarget, obj){
        for (var param in obj){
            if (obj.hasOwnProperty(param)){
                if (obj[param]){
                    esriParamTarget[param] = obj[param];
                }
            }
        }
        
        return esriParamTarget;
    };

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
    };

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
    };

    o.queryForStats = function(url, params, statdefs){
        //Create StatisticDefinition object for a query,
        //then query layer
        var deferred = new Deferred();
        var statDefArray = statdefs.map(function(def){
            return obj_to_esriParams(new StatisticDefinition(),def);
        });
        params.outStatistics = statDefArray;
        return o.queryEsri(url, params);
        
    };

    o.queryEsri = function(url, params, execution) {
    	var queryTask = new QueryTask(url);
        var query = obj_to_esriParams(new Query(), params);
        // debugger;

    	var deferred = execute_task(queryTask,query,execution);
        return deferred;
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
