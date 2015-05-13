define([
  "dojo/Deferred",
  "dojo/promise/all",
  "dojo/_base/lang",
  "report/riskRequests",
  "report/config"
], function (Deferred,all,lang,riskRequest,config) {

    var featureArea;
    //Helper functions
    var getRiskByBreaks = function(high, low, value){
        if (value > high){
            return 3;
        }
        else if (value <= low){
            return 1;
        }
        return 2;
    };

    var getRiskByAreaBreaks = function(high, low){

        return function(results){
            var counts = results.histograms[0].counts[1];

            var area = countsToArea(counts);
            var riskFactor = area/featureArea;
                        
            return getRiskByBreaks(high,low,riskFactor);
        };
        
    };

    var getHighRiskIfPresent = function(results){
            if (!results.histograms.length ){
                return 1;
            }
            var counts = results.histograms[0].counts[1];

            if (counts>0){
                return 3;
            }
            return 1;
    };

    var remapRule = function(inputRanges, outputValues,rasterId){
        return {
                  "rasterFunction" : "Remap",
                  "rasterFunctionArguments" : {
                    "InputRanges" : inputRanges,//[0,1, 1,2014],
                    "OutputValues" : outputValues,//[0, 1],
                    "Raster": rasterId
                  },
                  "variableName" : "Raster"
        };
    };

    var remapLoss = function(rasterId){
        return remapRule([0,1, 1,2014],[0,1],rasterId);
    };

    var remapAlerts = function(rasterId){
        return remapRule([1,22],[1],rasterId)
    };

    var arithmeticRule = function(raster1,raster2, operation){
        return {
                 'rasterFunction': 'Arithmetic',
                 'rasterFunctionArguments': {
                    'Raster': raster1,
                    'Raster2': raster2,
                    'Operation': operation
                 }
             };
    };

    var lockRaster = function(rasterId){
        return {
                  "mosaicMethod" : "esriMosaicLockRaster",
                  "lockRasterIds": [parseInt(rasterId.replace("$",""))],
                  "ascending" : true,
                  "mosaicOperation" : "MT_FIRST"
                }
    };

    var countsToArea = function(count, pixelSize){
        var pixelArea = pixelSize*pixelSize;
        var sqm = count*pixelArea;
        var area = sqm/10000;
        return area;
    };

    var methods = { 
        histogram: riskRequest.computeHistogram, 
        query: riskRequest.queryEsri
    };
    

    var services = { 
        commodities: "http://gis-gfw.wri.org/arcgis/rest/services/GFW/analysis/ImageServer",
        fires: "http://gis-potico.wri.org/arcgis/rest/services/Fires/FIRMS_ASEAN/MapServer/0"
    };

    var riskRequst = function(url,method,params){

    };

    var priorities = [
        {
            'label': 'Legality',
            categories: ['legality'],
        },
        {
            'label': 'Deforestation',
            categories: ['loss','area_primForest','loss_primForest', 'total_clear', 
            'clear_primForest', 'loss_carbon','area_carbon','alerts_carbon'],
            high: 27,
            low: 21
        },
        {
            'label': 'Carbon',
            categories: ['loss_carbon','alerts_carbon','area_carbon']
        },
        {
            'label': 'Peat',
            categories: ['loss_peat_area','peat_alerts','peat_area'],
            high: 7,
            low: 4
        },
        {
            'label': 'RSPO',
            categories: ['rspo'],
        },
        {
            'label': 'Fires',
            categories: ['fires'],
        }
    ];

    var categories = [

            {
                category: 'legality',
                service: services.commodities,
                request: methods.histogram,
                ind_params:{
                        renderingRule: remapRule(   [0,2, 2,3, 3,5, 5,6, 6,7],
                                                    [0, 1, 0, 1, 0],
                                                    config.legalClass.rasterId
                                                ),
                        pixelSize: 100          
                    },
                params:{
                        renderingRule: lockRaster(config.protectedArea.rasterId),
                        pixelSize: 100  
                },

                callbacks: {
                    'radius': getHighRiskIfPresent,
                    'concession': getHighRiskIfPresent
                },

                ind_callback: getHighRiskIfPresent
            },
            
            { 
                category: 'loss',
                service: services.commodities,
                request: methods.histogram,
                params:{
                    renderingRule: remapLoss(config.treeCoverLoss.rasterId),
                    pixelSize: 100
                },
                callbacks: {
                    'radius': function(results){
                        var calculatedMultiplier = .02;
                        var area = countsToArea(results.histograms[0].counts[1],100)
                        var pctArea = area/featureArea;
                        return getRiskByBreaks(.05,.28,pctArea);
                    },
                    'concession': function(results){
                        var calculatedMultiplier = .02;
                        var area = countsToArea(results.histograms[0].counts[1],100)
                        var pctArea = area/featureArea;
                        return getRiskByBreaks(.05,.28,pctArea);
                    }
                }
            },

            { 
                category: 'area_primForest',
                service: services.commodities,
                request: methods.histogram,
                params:{
                    renderingRule: remapRule([1,3],[1],config.primaryForest.rasterId),
                    pixelSize: 100
                },
                callbacks: {
                    'radius': getRiskByAreaBreaks(.12,.18),
                    'concession': getRiskByAreaBreaks(.12,.18)
                }
            },

            { 
                category: 'loss_primForest',
                service: services.commodities,
                request: methods.histogram,
                ind_params: {
                        renderingRule: arithmeticRule(
                            remapLoss(config.treeCoverLoss.rasterId),
                            config.primaryForest.rasterId,
                            3
                        ),
                        pixelSize: 100
                    },
                params:{
                        renderingRule: arithmeticRule(
                            remapLoss(config.treeCoverLoss.rasterId),
                            config.intactForest.rasterId,
                            3
                        ),
                        pixelSize: 100
                    },
                callbacks: {
                    'radius': getHighRiskIfPresent,
                    'concession': getHighRiskIfPresent
                }
            },

            { 
                category: 'total_clear',
                service: services.commodities,
                request: methods.histogram,
                params:{
                    // mosaicRule: lockRaster(config.clearanceAlerts.rasterId),
                    renderingRule: remapAlerts(config.clearanceAlerts.rasterId),
                    pixelSize: 500
                },
                callbacks: {
                    'radius': getHighRiskIfPresent,
                    'concession': getHighRiskIfPresent
                }
            },

            { 
                category: 'clear_primForest',
                service: services.commodities,
                request: methods.histogram,
                ind_params: {
                        renderingRule: arithmeticRule(
                            remapAlerts(config.clearanceAlerts.rasterId),
                            remapRule([1,3],[1], config.primaryForest.rasterId),
                            3
                        ),
                        pixelSize: 100
                    },
                params:{
                        renderingRule: arithmeticRule(
                            remapAlerts(config.clearanceAlerts.rasterId),
                            config.intactForest.rasterId,
                            3
                        ),
                        pixelSize: 100
                    },
                callbacks: {
                    'radius': getHighRiskIfPresent,
                    'concession': getHighRiskIfPresent
                }
            },

            { 
                category: 'area_carbon',
                service: services.commodities,
                request: methods.histogram,
                params:{
                    renderingRule: remapRule(
                            [0,100, 100,369],
                            [0,1],
                            config.carbonStock.rasterId
                        ),
                    pixelSize: 500
                },
                callbacks: {
                    'radius': getRiskByAreaBreaks(0,.2),
                    'concession': getRiskByAreaBreaks(0,.2)
                }
            },

            { 
                category: 'loss_carbon',
                service: services.commodities,
                request: methods.histogram,
                params:{
                    renderingRule: arithmeticRule(
                        remapLoss(config.treeCoverLoss.rasterId),
                        remapRule(
                            [0,20, 20,100, 100,369],
                            [0,1,2],
                            config.carbonStock.rasterId
                        ),
                        3
                    ),
                    pixelSize: 500
                },
                callbacks: {
                    'radius': function(results){
                        return results.histograms.length || 1;
                    },
                    'concession': function(results){
                        return results.histograms.length || 1;
                    }
                }
            },

            { 
                category: 'alerts_carbon',
                service: services.commodities,
                request: methods.histogram,
                params:{
                    renderingRule: remapRule(
                            [0,1, 1,369],
                            [0,1],
                            config.carbonStock.rasterId
                        ),
                    pixelSize: 500
                },
                callbacks: {
                    'radius': getHighRiskIfPresent,
                    'concession': getHighRiskIfPresent
                }
            },

            { 
                category: 'rate_change_loss',
                service: services.commodities,
                request: methods.histogram,
                params:{
                    renderingRule: '',
                    pixelSize: 100
                },
                callbacks:{
                    radius: function(results){},
                    'concession': function(results){}
                } 

            },

             { 
                category: 'loss_peat_area',
                service: services.commodities,
                request: methods.histogram,

                params:{
                    renderingRule: arithmeticRule(remapLoss(config.treeCoverLoss.rasterId),config.peatLands.rasterId,3),
                    pixelSize: 100
                },
                callbacks: {
                    'radius': getHighRiskIfPresent,
                    'concession': getHighRiskIfPresent
                }
            },

            { 
                category: 'peat_alerts',
                service: services.commodities,
                request: methods.histogram,
                params:{
                    renderingRule: arithmeticRule(remapAlerts(config.clearanceAlerts.rasterId),config.peatLands.rasterId,3),
                    pixelSize: 100
                },
                
                callbacks: {
                    'radius': getHighRiskIfPresent,
                    'concession': getHighRiskIfPresent
                }
            },
        
            { 
                category: 'peat_area',
                service: services.commodities,
                request: methods.histogram,
                params:{
                    mosaicRule: lockRaster(config.peatLands.rasterId),
                    pixelSize: 100
                },
                
                callbacks: {
                    'radius': getRiskByAreaBreaks(0.0059,0.0063),
                    'concession': getRiskByAreaBreaks(0.0059,0.0063)
                }

            },

            

            {
                category: 'fires',
                service: services.fires,
                request: methods.query,
                params:{
                        where: '1=1', 
                        geometry: '',
                },
                execution: 'executeForCount',

                callback: function(results, deferred){
                    
                    if (results>0){
                        return 3;
                    }
                    return 1;
                   
                },
                callbacks: {
                    'radius': function(results, deferred){
                    
                        if (results>0){
                            return 3;
                        }
                        return 1;
                       
                    },
                    'concession': function(results, deferred){
                    
                        if (results>0){
                            return 3;
                        }
                        return 1;
                       
                    }
                }
            }
    ];

    var calculatePriority = function(results){
        // Need a clone because if this gets called multiple times, multiple keys get embedded
        var clonedPriorities = lang.clone(priorities);


        clonedPriorities.forEach(function(priority){
            var total = 0;
            if (priority.categories.length == 1){
                var risk = results[priority.categories[0]];
            }
            // else if(priority.label === 'RSPO'){
            //     priority.risk = 
            // }
            else{
                var cats = [];
                priority.categories.forEach(function(cat, index){
                    total += results[cat];
                    cats.push({ 'key':cat, 'risk': results[cat] });
                });
                priority.categories = cats;
                var risk = getRiskByBreaks(priority.high,priority.low,total);

            }
                priority.risk = risk;
        });
        return clonedPriorities;
    };

    // Polygon Geometry, Area of Geometry, Area Type, RSPO Status, Is it in Indonesia
    return function(geometry, area, areaType, rspo, indonesia){
        var final_deferred = new Deferred();
        featureArea = area;
        rspo = rspo;
        indonesia = indonesia;

        var promises = [];
        categories.forEach(function(category){
            var deferred = new Deferred();
            var params = indonesia && category.ind_params? category.ind_params : category.params;

            if (category.request == riskRequest.computeHistogram){
                params.renderingRule = JSON.stringify(params.renderingRule);
                params.mosaicRule = params.mosaicRule ? JSON.stringify(params.mosaicRule) : '';
                params.geometryType = 'esriGeometryPolygon';
                params.geometry = JSON.stringify(geometry);

            }
            else{
                params.geometry = geometry;

            }
            params.f = 'json';
            category.request(category.service,params,category.execution).then(function(results){
                var obj = {};
                // var callback = indonesia && category.ind_callback ? category.ind_callback : category.callback;
                var callback = category.callbacks[areaType];
                category.results = results;
                obj[category.category] = callback(results,deferred);
                deferred.resolve(obj);
            });
            promises.push(deferred.promise);
        });

        all(promises).then(function(results){
            var data = {};
            results.forEach(function(result){
                lang.mixin(data,result);
            });
            var priorities = calculatePriority(data);
            final_deferred.resolve(priorities);
        });

        return final_deferred.promise;
    };
    // return final_deferred;
});
