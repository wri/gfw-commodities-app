define([
  "lodash",
  "dojo/Deferred",
  "dojo/promise/all",
  "dojo/_base/lang",
  "esri/geometry/geometryEngine",
  "esri/geometry/Polygon",
  "report/riskRequests",
  "report/config"
  // "app/riskRequests",
  // "app/testconfig"
], function (_, Deferred, all, lang, geoEngine, Polygon, riskRequest, config) {

    var o = {};
    // Polygon Geometry, Area of Geometry, Area Type, RSPO Status, Is it in Indonesia

    var eckert = 54012;
    var webmercator = 102100;
    var risk_labels = ['','low','medium','high'];
    config.carbonDensity = {rasterId:"$524"};


    var services = {
        commodities: 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/analysis/ImageServer',
        fires: "http://gis-potico.wri.org/arcgis/rest/services/Fires/FIRMS_ASEAN/MapServer/0",
        concessions: "http://gis-gfw.wri.org/arcgis/rest/services/CommoditiesAnalyzer/moremaps2_EN/MapServer/27"
    };

    var setWMconfig = function(){
        config.treeCoverLoss.rasterId = "$13";
        config.clearanceAlerts.rasterId = "$2";
        config.intactForest.rasterId = "$9";
        config.primaryForest.rasterId = "$11";
        config.legalClass.rasterId = "$7";
        config.protectedArea.rasterId = "$10";
        config.peatLands.rasterId = "$8";
        config.carbonDensity.rasterId = "$15";

    };

    // setWMconfig();

    o.getRiskByGeometry = function(geometry, area, areaType, rspo, indonesia, riskResults, concessions){
        var featureArea = area;
    //Helper functions
        var getRiskByBreaks = function(low, high, value){
            if (value > high){
                return 3;
            }
            else if (value <= low){
                return 1;
            }
            return 2;
        };

        var getRiskByBreaksCallback = function(low,high){
            return function(results){
                if(!results.histograms[0]){
                    return 1;
                }
                var value = results.histograms[0].counts[1] || 0;
                if (value > high){
                    return 3;
                }
                else if (value <= low){
                    return 1;
                }
                return 2;
            };
        };

        var getRiskByAreaBreaks = function(low,high,pixelSize){
            return function(results){
                if(!results.histograms[0]){
                    return getRiskByBreaks(low,high,0);
                }
                var counts = results.histograms[0].counts[1] || 0;

                var countArea = countsToArea(counts,pixelSize);
                var riskFactor = countArea/featureArea;

                var breaks = {low:low,high:high};
                // console.log(breaks,areaType, counts, area, featureArea, riskFactor)
                return getRiskByBreaks(low,high,riskFactor);
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

        var getCarbonHighRiskIfPresent = function(results){
                if (!results.histograms.length ){
                    return 1;
                }
                var counts = results.histograms[0].counts;
                if(counts[2]){
                    return 3;
                }
                if(counts[1]){
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
                        "Raster": rasterId,
                        "AllowUnmatched": false
                      },
                      "variableName" : "Raster"
            };
        };

        var remapLoss = function(rasterId){
            return remapRule([0,1, 1,14],[0,1],rasterId);
        };

        var remapAlerts = function(rasterId){
            return remapRule([1,22],[1],rasterId);
        };

        var remapHighCarbonDensity = function(rasterId){
            return remapRule([1,20, 20,369],[0,1],rasterId);
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
                    };
        };

        var countsToArea = function(count, pixelSize){
            var pixelArea = pixelSize*pixelSize;
            var sqm = count*pixelArea;
            // var area = sqm/10000;
            return sqm;
        };

        var methods = {
            histogram: riskRequest.computeHistogram,
            query: riskRequest.queryEsri
        };


        var riskRequst = function(url,method,params){

        };

        var priority_breaks = {low:7,high:12};

        var priorities = [
            {
                'label': 'legal',
                categories: ['legal'],
                'singleIndicator': true
            },
            {
                'label': 'deforestation',
                // categories: [
                //     'umd_loss',
                //     // 'area_primary',
                //     'umd_loss_primary',
                //     'forma',
                //     'forma_primary',
                //     // 'forma_peat',
                //     'loss_carbon'/*, 'area_carbon','area_carbon','alerts_carbon'*/],
                // // categories: ['area_carbon'],
                high: 21,
                low: 13
                // high: 27,
                // low: 21
            },
            // {
            //     'label': 'Carbon',
            //     categories: ['loss_carbon','alerts_carbon','area_carbon']
            // },
            {
                'label': 'peat',
                // categories: ['loss_peat_area','peat_alerts','peat_presence'],
                high: 7,
                low: 4
                // high: 7,
                // low: 4
            },
            {
                'label': 'rspo',
                categories: ['rspo'],
            },
            {
                'label': 'fire',
                categories: ['fire'],
                'singleIndicator': true
            }
        ];

        var categories = [

                {
                    // key: 'loss_carbon',
                    key: 'carbon',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    params:{
                        renderingRule: arithmeticRule(
                            remapLoss(config.treeCoverLoss.rasterId),
                            remapRule(
                                [0,20, 20,80, 80,100],
                                [0,1,2],
                                config.carbonDensity.rasterId
                            ),
                            3
                        ),
                        pixelSize: 100
                    },
                    callbacks: {
                        'radius': getCarbonHighRiskIfPresent,
                        'concession': getCarbonHighRiskIfPresent
                    }
                },

                {
                    key: 'forma',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    params:{
                        // mosaicRule: lockRaster(config.clearanceAlerts.rasterId),
                        renderingRule: remapAlerts(config.clearanceAlerts.rasterId),
                        pixelSize: 500
                    },
                    callbacks: {
                        'radius': getRiskByBreaksCallback(1,250*.02),
                        'concession': getRiskByBreaksCallback(25,295)
                    }
                },

                {
                    key: 'forma_carbon',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    params:{
                        renderingRule: arithmeticRule(
                                remapAlerts(config.clearanceAlerts.rasterId),
                                remapHighCarbonDensity(config.carbonDensity.rasterId),
                                3
                            ),
                        pixelSize: 30
                    },
                    callbacks: {
                        'radius': getHighRiskIfPresent,
                        'concession': getHighRiskIfPresent
                    }
                },

                {
                    key: 'area_carbon',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    params:{
                        renderingRule: remapHighCarbonDensity(config.carbonDensity.rasterId),
                        pixelSize: 30
                    },
                    callbacks: {
                        'radius': getRiskByAreaBreaks(0.747,0.913,30),
                        'concession': getRiskByAreaBreaks(0,.2,30)
                    }
                },

                {
                    key: 'area_primary',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    ind_params:{
                        renderingRule: remapRule([0,1, 1,3],[0,1],config.primaryForest.rasterId),
                        pixelSize: 100
                    },
                    params:{
                        renderingRule: remapRule([0,1, 1,3],[0,1],config.intactForest.rasterId),
                        pixelSize: 100
                    },
                    callbacks: {
                        'radius': getRiskByAreaBreaks(.12,.18,100),
                        'concession': getRiskByAreaBreaks(0,.2,100)
                    }
                },

                {
                    key: 'forma_primary',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    ind_params: {
                            renderingRule: arithmeticRule(
                                remapAlerts(config.clearanceAlerts.rasterId),
                                remapRule([1,3],[1], config.primaryForest.rasterId),
                                3
                            ),
                            pixelSize: 30
                        },
                    params:{
                            renderingRule: arithmeticRule(
                                remapAlerts(config.clearanceAlerts.rasterId),
                                config.intactForest.rasterId,
                                3
                            ),
                            pixelSize: 30
                        },
                    callbacks: {
                        'radius': getHighRiskIfPresent,
                        'concession': getHighRiskIfPresent
                    }
                },

                {
                    key: 'umd_loss',
                    category: 'deforestation',
                    service: services.commodities,
                    request: methods.histogram,
                    params:{
                        renderingRule: remapLoss(config.treeCoverLoss.rasterId),
                        pixelSize: 30
                    },
                    callbacks: {
                        'radius': getRiskByAreaBreaks(.05*.02,.28*.02,30),
                        'concession': getRiskByAreaBreaks(.05,.28,30)
                    }
                },

                {
                    key: 'umd_loss_primary',
                    category: 'deforestation',
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
                    key: 'fire',
                    category: 'fire',
                    service: services.fires,
                    request: methods.query,
                    params:{
                            where: 'BRIGHTNESS>=330 AND CONFIDENCE>=30',
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
                },

                {
                    key: 'legal',
                    category: 'legal',
                    service: services.commodities,
                    request: methods.histogram,
                    ind_params:{
                            renderingRule: remapRule(
                                                        [0,1, 1,2, 2,3, 3,4, 4,7],
                                                        [1, 0, 1, 0, 1],
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
                    // key: 'loss_peat_area',
                    key: 'clearance',
                    category: 'peat',
                    service: services.commodities,
                    request: methods.histogram,

                    params:{
                        renderingRule: arithmeticRule(
                            remapLoss(config.treeCoverLoss.rasterId),
                            config.peatLands.rasterId,
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
                    key: 'alerts',
                    category: 'peat',
                    service: services.commodities,
                    request: methods.histogram,
                    params:{
                            renderingRule: arithmeticRule(
                                remapAlerts(config.clearanceAlerts.rasterId),
                                config.peatLands.rasterId,
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
                    key: 'presence',
                    category: 'peat',
                    service: services.commodities,
                    request: methods.histogram,
                    params:{
                        // mosaicRule: lockRaster(config.peatLands.rasterId),
                        renderingRule: remapRule([0,1, 1,2],[0,1],config.peatLands.rasterId),
                        pixelSize: 100
                    },

                    callbacks: {
                        'radius': getRiskByAreaBreaks(.9*0.0059,1.1*0.0063),//getRiskByAreaBreaks(0.02,0.05,100),//
                        'concession': getRiskByAreaBreaks(.9*0.0059,1.1*0.0063)//getRiskByAreaBreaks(0.02,0.05,100)//getRiskByAreaBreaks(0.0059,0.0063)
                    }

                }


        ];

        var getCategoryByKey = function(key){
            var grouped = _.groupBy(categories,'key');
            var key = grouped[key][0].category;

            return key;
        }

        var calculatePriority = function(results,areaType){
            // Need a clone because if this gets called multiple times, multiple keys get embedded
            var clonedPriorities = lang.clone(priorities);
            var priority_level = 0;

            _.forIn(results,function(value,key){

                var category = getCategoryByKey(key);
                if (!riskResults[category]){
                    riskResults[category] = {};
                }

                var single = _.result(_.find(priorities,{'label':category}),'singleIndicator')
                if(single){
                    riskResults[category][areaType] = {risk:risk_labels[value]};
                    priority_level += value;
                }
                else{
                    if(!riskResults[category][key]){
                        riskResults[category][key] = {}
                    }
                    riskResults[category][key][areaType] = {risk:risk_labels[value]};
                }

            });


            clonedPriorities.forEach(function(priority){
                var total = 0;
                if(!priority.high){
                    return;
                }
                // else if(priority.label === 'RSPO'){
                //     priority.risk =
                // }
                var cats = [];

                var categores = _.pluck(_.groupBy(categories,'category')[priority.label],'key');
                categories.forEach(function(cat, index){
                    total += results[cat];
                    priority_level += results[cat];
                    cats.push({ 'key':cat, 'risk': results[cat] });
                });
                priority.categories = cats;
                var risk = getRiskByBreaks(priority.high,priority.low,total);

                var category = priority.label;
                    priority.risk = risk;
                    if (!riskResults[category]){
                        riskResults[category] = {};
                    }
                    var key = priority.label + '_' + areaType;
                    riskResults[category][key] = risk_labels[risk];
            });
            priority_level = getRiskByBreaks(priority_breaks.low,priority_breaks.high,priority_level);
            riskResults['priority_level_'+areaType] = risk_labels[priority_level];
            if (priority_level>riskResults['total_mill_priority_level']){
                riskResults['total_mill_priority_level'] = priority_level;
            }
            return riskResults;
        };


        var final_deferred = new Deferred();
        rspo = rspo;
        indonesia = indonesia;
        riskResults['total_mill_priority_level'] = riskResults['total_mill_priority_level'] || 0;

        var promises = [];
        if(!geometry){
            var riskObj = {};
            _.pluck(categories,'key').forEach(function(key){
                riskObj[key] = 0;
            })
            calculatePriority(riskObj,areaType);
            final_deferred.resolve(riskObj);

            return final_deferred.promise;
        }

        var splitConcessions = function(geometries,category,params,deferred){
            var promises = geometries.map(function(geometry){
                params.geometry = JSON.stringify(geometry);
                return category.request(category.service,params,category.execution);
            })

            all(promises).then(function(results){
                var output = {histograms:[{counts:[]}]};
                var countsArr = _.pluck(_.flatten(_.pluck(results,'histograms')),'counts');

                countsArr.forEach(function(counts){
                    counts.forEach(function(count,index){

                        output.histograms[0].counts[index] = output.histograms[0].counts[index] || 0;
                        output.histograms[0].counts[index] += count;
                    });
                });
                var obj = {};
                // var callback = indonesia && category.ind_callback ? category.ind_callback : category.callback;
                var callback = category.callbacks[areaType];
                category.results = output;
                obj[category.key] = callback(output,deferred);
                deferred.resolve(obj);

            },function(err){
                console.log("SPLIT ERROR",err)
            });
        }



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
                obj[category.key] = callback(results,deferred);
                deferred.resolve(obj);
            },function(err){
                console.log("HISTOGRAM ERROR", err);
                if(concessions){
                    splitConcessions(concessions,category,params,deferred);
                }
            });
            promises.push(deferred.promise);
        });

        all(promises).then(function(results){
            var data = {};
            results.forEach(function(result){
                lang.mixin(data,result);
            });
            var priorities = calculatePriority(data,areaType);
            final_deferred.resolve(priorities);
        });

        return final_deferred.promise;
    };

    o.getGeometryArea = function(url,geometry){
        var deferred = new Deferred();
            // var area = 147156063.470948//geoEngine.planarArea(simplify)
            var params = {
                areaUnit: 'UNIT_SQUARE_METERS',
                lengthUnit: 'UNIT_METERS',
                calculationType: 'geodesic',
                polygons:[geometry]
            }
            riskRequest.getAreasLengths(url,params).then(function(results){
                deferred.resolve(results.areas[0]);
            })
        return deferred;
    }

    o.getConcessionRisk = function(radiusGeometry,rspo,indonesia,riskResults){
        var deferred = new Deferred();
        var url = services.concessions;
        var poly = new Polygon(radiusGeometry);
        var params = {
            geometry: poly,
            where:"CERT_SCHEME = 'RSPO' AND TYPE = 'Oil palm concession'",
            outFields:["OBJECTID"],
            returnGeometry: true
        }

        riskRequest.queryEsri(url,params).then(function(results){
            var url = config.geometryServiceUrl;
            var geometries = results.features.map(function(feature){
                return feature.geometry;
            });
            if (geometries.length<1){
                var riskObj = {};
                o.getRiskByGeometry(false, 0, 'concession', rspo, indonesia,riskResults);
                deferred.resolve()
                return;
            }
            var union = geoEngine.union(geometries);
            var simplify = geoEngine.simplify(union);
            var poly = new Polygon(simplify);

            var params = {
                geometries: [poly]
            }

            riskRequest.project(url,params,webmercator).then(function(results){
                var projPoly = new Polygon(results[0]);

                o.getGeometryArea(url,projPoly).then(function(geomArea){
                        var task = o.getRiskByGeometry(results[0], geomArea, 'concession', rspo, indonesia,riskResults,geometries);
                        task.then(function(results){
                            deferred.resolve();
                        });
                })
            })




        });
        return deferred
    }

    o.printProjectGeom = function(geom){
         var url = config.geometryServiceUrl;
            // var union = geoEngine.union(geometries);
            // var simplify = geoEngine.simplify(union);
            var poly = new Polygon(geom);

            var params = {
                geometries: [poly]
            }

            riskRequest.project(url,params,102100).then(function(results){
                console.log("BUFFER GEOM",JSON.stringify(results[0]))
            })
    }

    o.getRadiusBuffer = function(point,distance){
        var url = config.geometryServiceUrl;

        var deferred = new Deferred();

        var buffParams = {
            unit: 'UNIT_KILOMETER',
            distances: [distance],
            geometries: [point]
        }
        riskRequest.buffer(url,buffParams,webmercator).then(function(results){
            var buffPoly = results[0];
            o.getGeometryArea(url,buffPoly).then(function(area){
                    deferred.resolve({geometry:results[0],area:area});
            })
            // o.printProjectGeom(buffPoly);
        })
        return deferred;
    }

    o.getRisk = function(point,distance, rspo,indonesia){
        var deferred = new Deferred();
        var riskResults = {};

        o.getRadiusBuffer(point,distance).then(function(results){
            var area = distance*1000*distance*1000*Math.PI;//results.area;
            var radius = results.geometry;
            var rad = o.getRiskByGeometry(radius,area,'radius',rspo,indonesia,riskResults);
            var con = o.getConcessionRisk(radius,rspo,indonesia,riskResults);

            all([rad,con]).then(function(results){
                riskResults["total_mill_priority_level"] = risk_labels[riskResults["total_mill_priority_level"]];
            deferred.resolve(lang.clone(riskResults));
        });

        });

        return deferred
    }

    return o;
    // return final_deferred;
});
