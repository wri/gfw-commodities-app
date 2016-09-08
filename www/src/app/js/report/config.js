define([], function() {

    var geometryServiceUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/Utilities/Geometry/GeometryServer',

        clearanceAlertsUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/forma_500/ImageServer',

        // clearanceAlertsUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/analysis_wm/ImageServer',

        gladUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/glad_alerts_analysis/ImageServer/computeHistograms',

        imageServiceUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/analysis/ImageServer',
        suitabilityUrl = 'http://gis-potico.wri.org/arcgis/rest/services/suitabilitymapper/kpss_mosaic/ImageServer',
        firesQueryUrl = 'http://gis-potico.wri.org/arcgis/rest/services/Fires/Global_Fires/MapServer',
        fieldAssessmentUrl = 'http://www.wri.org/publication/how-identify-degraded-land-sustainable-palm-oil-indonesia',
        clearanceAnalysisUrl = 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/analysis_wm/ImageServer',
        boundariesUrl = 'http://gis.wri.org/arcgis/rest/services/CountryBoundaries/CountryBoundaries/MapServer/0';

    // Totoal Loss
    var lossBounds = [1, 14],
        lossLabels = [2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014];

    // Prodes
    var prodesBounds = [1, 14],
        prodesLabels = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
        prodesColors = ['#25941F', '#25941F', '#25941F', '#25941F', '#25941F', '#25941F', '#209F1F', '#459F1F', '#279F1F', '#257F1F', '#269F1F', '#459F1F', '#253F1F', '#25941F', '#25941F'];

    // Guyra
    var guyraBounds = [1, 5],
        guyraLabels = [2011, 2012, 2013, 2014, 2015]; // 9/2011 - 10/2015
        // guyraColors = ['#25941F', '#25941F', '#25941F', '#25941F', '#25941F', '#25941F', '#209F1F', '#459F1F', '#279F1F', '#257F1F', '#269F1F', '#459F1F', '#253F1F', '#25941F', '#25941F'];

    // GLAD
    var gladBounds = [1, 14],
        gladLabels = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
        gladColors = ['#25941F', '#25941F', '#25941F', '#25941F', '#25941F', '#25941F', '#209F1F', '#459F1F', '#279F1F', '#257F1F', '#269F1F', '#459F1F', '#253F1F', '#25941F', '#25941F'];


    // Plantation Type
    var plantationsTypeBounds = [1, 4],
        plantationsTypeLabels = ['Large industrial plantation', 'Clearing/ very young plantation', 'Mosaic of medium-sized plantations', 'Mosaic of small-sized plantations'],
        plantationsTypeColors = ['#FEBEBF', '#874546', '#FEBFE7', '#8ACD6B'];

    // Plantation Species
    var plantationsSpeciesBounds = [1, 6],
        plantationsSpeciesLabels = ['Oil palm', 'Wood Fiber/Timber', 'Oil Palm Mix', 'Wood fiber/timber mix', 'Other', 'Recently cleared'],
        plantationsSpeciesColors = ['#FD8081', '#FEBEBF', '#B6D6A1', '#FFFD7E', '#6E4786', '#22C6FC'];

    // Tree Cover Density
    var treeCoverLabels = ['31 - 50%', '51 - 74%', '75 - 100%'],
        treeCoverBounds = [1, 3],
        treeCoverColors = ['#ccf1a5', '#859a59', '#4b5923'];

    // RSPO
    var rspoBounds = [0, 3],
        rspoColors = ['#87CEEB', '#00AA00', '#DD0000', '#8A2BE2'];

    // Primary Forest
    var primaryForestLabels = ['Primary Degraded', 'Primary Intact'],
        primaryForestBounds = [1, 2],
        primaryForestColors = ['#259F1F', '#186513'];

    // Legal Classes
    var legalClassLabels = ['Convertible Production Forest', 'Limited Production Forest', 'Non-forest', 'Production Forest', 'Protected Area'],
        legalClassBounds = [1, 5],
        legalClassColors = ['rgb(230, 152, 0)', 'rgb(116, 196, 118)', 'rgb(255, 255, 190)', 'rgb(199, 233, 192)', 'rgb(35, 139, 69)'];

    var moratoriumLabels = ['Moratorium area'],
        moratoriumBounds = [0, 1],
        moratoriumColors = ['#5fc29a'];

    // Protected Areas
    var protectedAreaLabels = ['Protected Area'],
        protectedAreaBounds = [0, 1],
        protectedAreaColors = ['#296eaa'];

    // // Carbon Stocks
    // var carbonStockLabels = ['1-19', '20 - 79', 'Greater than 80'], //['0', '1 - 10', '11 - 20', '21- 35', '36 - 70', '71 - 100', '101 - 150', '151 - 200', '201 - 300', 'Greater than 300'],
    //     carbonStockBounds = [0, 2], //[0, 9],
    //     carbonStockColors = ['#fdffcc', '#f1bc8b', '#d56f4a']; //['#fdffcc', '#faeeb9', '#f6ddaa', '#f4ca99', '#f1bc8b', '#eca97a', '#e89c6f', '#e08b5e', '#db7c54', '#d56f4a'];

    var carbonStockLabels = ['0-100', '101 - 200', '201 - 300', '301 - 400', '401 - 500', 'Greater than 500'],
        carbonStockBounds = [1, 6],
        carbonStockColors = ['#fdffcc', '#faeeb9', '#f6ddaa', '#f4ca99', '#f1bc8b', '#eca97a'];


  // Brazil Biomes
    var brazilBiomesLabels = ['Pampa', 'Caatinga', 'Cerrado', 'Amazônia', 'Mata Atlântica', 'Pantanal'],
        brazilBiomesBounds = [0, 5],
        brazilBiomesColors = ['#4E7311', '#A6FD7C', '#C0E7AE', '#76B276', '#A3D3FD', '#084E73'];

    // Intact Forests
    var intactForestLabels = ['Intact Forest'],
        intactForestBounds = [0, 1],
        intactForestColors = ['#186513'];

    // Peat Lands
    var peatLandsLabels = ['Peat'],
        peatLandsBounds = [0, 1],
        peatLandsColors = ['#161D9C'];


  var lcGlobalLabels = ['Agriculture', 'Mixed agriculture and forest', 'Secondary forest', 'Primary forest', 'Mixed forest and grassland', 'Grassland / shrub', 'Swamp', 'Settlements', 'Bare land', 'Water bodies', 'Snow / ice'],
      lcGlobalBounds = [1, 11],
      lcGlobalColors = ['#E0A828', '#8BFB3B', '#D4FEC0', '#76B276', '#B98D5A', '#FFFEC1', '#689AA7', '#FCB7CB', '#D3CE63', '#77B5FC', '#FFFFFF'];


    // var lcGlobalLabels = ['Agriculture', 'Mixed agriculture and forest', 'Open broadleaved forest', 'Closed broadleaved forest', 'Open needleleaved forest', 'Closed needleleaved forest', 'Open mixed forest', 'Mixed forest and grassland', 'Grassland / shrub', 'Flooded forest', 'Wetland', 'Settlements', 'Bare land', 'Water bodies', 'Snow / ice', 'No data'],
    //     lcGlobalBounds = [1, 16],
    //     lcGlobalColors = ['#E0A828', '#8BFB3B', '#51952F', '#287310', '#B6D6A1', '#89C364', '#888749', '#B98D5A', '#FFFEC1', '#19A785', '#689AA7', '#FCB7CB', '#D3CE63', '#77B5FC', '#FFFFFF', '#B3B3B3'];

    var lcAsiaLabels = ['Agriculture', 'Agroforestry', 'Fish pond', 'Grassland / Shrub', 'Mining', 'Oil Palm Plantation', 'Primary Forest', 'Rubber Plantation', 'Secondary Forest', 'Settlements', 'Swamp', 'Timber Plantation', 'Water Bodies'],
        lcAsiaBounds = [1, 13],
        lcAsiaColors = ['#d89827', '#26fc79', '#b1e3fc', '#fdffb6', '#000', '#d89827', '#5fa965', '#eeb368', '#c7ffb6', '#fca0bf', '#538996', '#745b37', '#65a2f8'];

    var lcIndoLabels = ['Agriculture', 'Estate crop plantation', 'Fish pond', 'Grassland / Shrub', 'Mining', 'Primary Forest', 'Secondary Forest', 'Settlements', 'Swamp', 'Timber Plantation', 'Water Bodies'],
        lcIndoBounds = [1, 11],
        lcIndoColors = ['#d89827', '#eeb368', '#b1e3fc', '#fdffb6', '#000', '#5fa965', '#c7ffb6', '#fca0bf', '#538996', '#745b37', '#65a2f8'];

    return {

        corsEnabledServers: [
            'http://gis-potico.wri.org',
            'http://175.41.139.43',
            'http://54.164.126.73',
            'http://46.137.239.227',
            'https://gfw-fires.wri.org',
            'http://gis-gfw.wri.org'
        ],

        urls: {
            imageService: 'http://gis-gfw.wri.org/arcgis/rest/services/image_services/analysis/ImageServer'
        },

        messages: {
            largeAreaWarning: 'The area for this analysis request is quite large and may take some time to process.'
        },

        rasterFunctions: {
            range: {
                'rasterFunction': 'histogram16bit',
                'outputPixelType': 'U16',
                'rasterFunctionArguments': {
                    'Rasters': ['$529']
                }
            },
            combination: {
                'rasterFunction': 'Combination',
                'variableName': 'AnalysisRaster',
                'rasterFunctionArguments': {
                    'RasterRange': [1, 140],
                    'Raster2Length': [4],
                    'Raster': {
                        'rasterFunction': 'Combination',
                        'variableName': 'AnalysisRaster',
                        'rasterFunctionArguments': {
                            'RasterRange': [1, 14], // Change these values
                            'Raster2Length': [10], // Change these values
                            'Raster': '$530', // Change these values
                            'Raster2': '$2' // Change these values
                        }
                    },
                    'Raster2': {
                        'rasterFunction': 'Remap',
                        'rasterFunctionArguments': {
                            'InputRanges': [
                                946, 946,
                                947, 947,
                                948, 948,
                                949, 949
                            ],
                            'OutputValues': [1, 2, 3, 4],
                            'Raster': '$529',
                            'AllowUnmatched': false
                        },
                        'variableName': 'Raster'
                    }
                }
            }
        },

        boundariesUrl: boundariesUrl,
        geometryServiceUrl: geometryServiceUrl,
        imageServiceUrl: imageServiceUrl,
        clearanceAnalysisUrl: clearanceAnalysisUrl,

        printUrl: 'http://gis-potico.wri.org/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task/execute',

        alertUrl: {
            forma: 'http://gfw-apis.appspot.com/subscribe',
            fires: 'https://gfw-fires.wri.org/subscribe_by_polygon'
        },

        millPointInfo: {
            'concession': {
                'title': 'Concession Analysis',
                'content': 'A risk assessment for concession areas within a 50km sourcing radius of a palm oil mill.'
            },
            'radius': {
                'title': 'Radius Analysis',
                'content': 'A risk assessment for the entire area within a 50km sourcing radius around a palm oil mill.'
            }
        },

        /*
          Below is all the config items for the Analysis portion of the report
        */

        pixelSize: 100,

        /* Begin Main Layers for Analyses */
        totalLoss: {
            rasterId: '$530',
            bounds: lossBounds,
            labels: lossLabels
        },

        prodesLayer: {
          rasterId: '$555',
          bounds: prodesBounds,
          labels: prodesLabels
        },

        guyraLayer: {
          rasterId: '$565',
          bounds: guyraBounds,
          labels: guyraLabels
        },

        gladLayer: {
          rasterId: '$1', //12
          bounds: gladBounds,
          labels: gladLabels,
          clearanceChart: {
              title: 'Glaaaaad',
              type: 'pie'
          },
          lcHistogram: {
              renderRule: {
                'rasterFunction': 'Local',
                'rasterFunctionArguments': {
                  'Operation': 67, //max value; ignores no data
                  'Rasters': [{
                    'rasterFunction': 'Remap',
                    'rasterFunctionArguments': {
                      'InputRanges': [0, 150, 150, 366],
                      'OutputValues': [0, 1],
                      'Raster': '$1', //2015
                      'AllowUnmatched': false
                    }
                  }, {
                    'rasterFunction': 'Remap',
                    'rasterFunctionArguments': {
                      'InputRanges': [0, 20, 20, 366],
                      'OutputValues': [0, 1],
                      'Raster': '$2', //2016
                      'AllowUnmatched': false
                    }
                  }]
                }
              }
          }
        },

        // plantationsTypeLayer: {
        //   rasterId: '$558',
        //   bounds: plantationsTypeBounds,
        //   labels: plantationsTypeLabels
        // },
        //
        // plantationsSpeciesLayer: {
        //   rasterId: '$559',
        //   bounds: plantationsSpeciesBounds,
        //   labels: plantationsSpeciesLabels
        // },

        clearanceAlerts: {
            rasterId: '$17'
            // rasterId: '$2'
        },

        millPoints: {
            url: 'http://api.risk-api.appspot.com/',
            title: 'PALM Risk Tool',
            rootNode: 'millPoints'
        },

        suitability: {
            url: suitabilityUrl,
            title: 'Suitability',
            rootNode: 'suitabilityAnalysis',
            rasterFunction: 'PalmOilSuitability_Histogram',
            geometryType: 'esriGeometryPolygon',
            lcHistogram: {
                renderRule: {
                    rasterFunction: 'lc_histogram',
                    rasterFunctionArguments: {
                        'LCRaster': '$12',
                        'LCInpR': [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8],
                        'LCOutV': [0, 1, 2, 3, 4, 5, 6, 7, 8]
                    }
                },
                renderRuleSuitable: {
                    rasterFunction: 'classify_suitability',
                    rasterFunctionArguments: {
                        'TargetRaster': '$12',
                        'InpTarget': [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8],
                        'OutVTarget': [0, 1, 2, 3, 4, 5, 6, 7, 8]
                    }
                },
                classIndices: {
                    'convertible': [1],
                    'production': [2, 4],
                    'other': [3]
                }
            },
            roadHisto: {
                mosaicRule: {
                    'mosaicMethod': 'esriMosaicLockRaster',
                    'lockRasterIds': [14],
                    'ascending': true,
                    'mosaicOperation': 'MT_FIRST'
                },
                className: 'ROAD_DISTANCE_KM'
            },
            concessions: {
                url: 'http://gis-potico.wri.org/arcgis/rest/services/CommoditiesAnalyzer/moremaps2_EN/MapServer',
                layer: '10'
            },
            localRights: {
                content: 'Local rights/interests:  Unknown.  To be determined through field assessments.',
                fieldAssessmentUrl: fieldAssessmentUrl,
                fieldAssessmentLabel: 'Learn about field assessments.'
            },
            chart: {
                title: 'Suitability by Legal Classification',
                suitable: {
                    color: '#461D7C',
                    name: 'Suitable',
                    id: 'donut-Suitable'
                },
                unsuitable: {
                    color: '#FDD023',
                    name: 'Unsuitable',
                    id: 'donut-Unsuitable'
                },
                childrenLabels: ['HP/HPT', 'HPK', 'APL'],
                childrenColors: ['#74C476', '#E69800', '#FFFFBE']
            }
        },

        // The following is a dependency for all clearance alerts queries, this gets the number of labels and bounds
        // and must be used before any queries for clearanceAlerts will work
        clearanceBounds: {
            url: clearanceAlertsUrl,
            baseYearLabel: 15
        },

        /* End Main Layers for Analyses */

        /* Here are all the other Layers used in the results */
        rspo: {
            rootNode: 'rspoData',
            title: 'RSPO Land Use Change Analysis',
            rasterId: '$5',
            bounds: rspoBounds,
            lossBounds: [5, 13],
            colors: rspoColors
        },

        primaryForest: {
            rootNode: 'primaryForest',
            title: 'Primary Forests - Indonesia',
            rasterId: '$519', //11
            formaId: '$11',
            bounds: primaryForestBounds,
            labels: primaryForestLabels,
            clearanceChart: {
                title: 'Clearance Alerts in Primary Forests since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) in Primary Forests',
                removeBelowYear: 2005
            },
            compositionAnalysis: {
                rasterId: 519,
                histogramSlice: 1
            },
            colors: primaryForestColors,
            fireKey: 'primaryForest' // Key to the Fires Config for items related to this
        },

        treeCover: {
            rootNode: 'treeCoverDensity',
            title: 'Tree Cover Density',
            rasterId: '$520', //13
            formaId: '$12',
            includeFormaIdInRemap: true,
            rasterRemap: {
                'rasterFunction': 'Remap',
                'rasterFunctionArguments': {
                    'InputRanges': [31, 51, 51, 75, 75, 101],
                    'OutputValues': [1, 2, 3],
                    'Raster': '$520',
                    'AllowUnmatched': false
                }
            },
            bounds: treeCoverBounds,
            labels: treeCoverLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Tree Cover Density since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Tree Cover Density'
            },
            compositionAnalysis: {
                title: 'Tree Cover Density (30%-100%)',
                rasterId: 520,
                histogramSlice: 31
            },
            colors: treeCoverColors,
            fireKey: 'treeCover', // Key to the Fires Config for items related to this
            errors: {
                composition: 'No Tree Cover Density greater than 30% detected in this area.'
            }
        },

        // plantationsTypeLayer: {
        //     rootNode: 'plantationsTypeLayer',
        //     title: 'Plantations by Type',
        //     rasterId: '$558',
        //     formaId: '$12',
        //     includeFormaIdInRemap: true,
        //     rasterRemap: {
        //         'rasterFunction': 'Remap',
        //         'rasterFunctionArguments': {
        //             'InputRanges': [31, 51, 51, 75, 75, 101],
        //             'OutputValues': [1, 2, 3],
        //             'Raster': '$558',
        //             'AllowUnmatched': false
        //         }
        //     },
        //     bounds: plantationsTypeBounds,
        //     labels: plantationsTypeLabels,
        //     clearanceChart: {
        //         title: 'plantationsTypesince Jan 2015',
        //         type: 'pie'
        //     },
        //     lossChart: {
        //         title: 'plantation sTypeeee'
        //     },
        //     compositionAnalysis: {
        //         title: 'plantations Typeee',
        //         rasterId: 558//,
        //         // histogramSlice: 31
        //     },
        //     colors: plantationsTypeColors,
        //     fireKey: 'plantationsType', // Key to the Fires Config for items related to this
        //     errors: {
        //         composition: 'NplantationsTypeBoundsn 30% detected in this area.'
        //     }
        // },
        //
        // plantationsSpeciesLayer: {
        //     rootNode: 'plantationsSpeciesLayer',
        //     title: 'Plantations by Species',
        //     rasterId: '$559',
        //     formaId: '$12',
        //     includeFormaIdInRemap: true,
        //     rasterRemap: {
        //         'rasterFunction': 'Remap',
        //         'rasterFunctionArguments': {
        //             'InputRanges': [31, 51, 51, 75, 75, 101],
        //             'OutputValues': [1, 2, 3],
        //             'Raster': '$559',
        //             'AllowUnmatched': false
        //         }
        //     },
        //     bounds: plantationsTypeBounds,
        //     labels: plantationsTypeLabels,
        //     clearanceChart: {
        //         title: 'plantationsTypesince Jan 2015',
        //         type: 'pie'
        //     },
        //     lossChart: {
        //         title: 'plantation speciess'
        //     },
        //     compositionAnalysis: {
        //         title: 'plantations Typeee',
        //         rasterId: 559//,
        //         // histogramSlice: 31
        //     },
        //     colors: plantationsTypeColors,
        //     fireKey: 'plantationsType', // Key to the Fires Config for items related to this
        //     errors: {
        //         composition: 'No Tree Cover Density greater than 30% detected in this area.'
        //     }
        // },

        treeCoverLoss: {
            rootNode: 'treeCoverLoss',
            title: 'Tree Cover Loss',
            rasterId: '$517',
            mosaicRule: {
                'mosaicMethod': 'esriMosaicLockRaster',
                'lockRasterIds': [530],
                'ascending': true,
                'mosaicOperation': 'MT_FIRST'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares)'
            },
            compositionAnalysis: {
                rasterId: 530,
                histogramSlice: 1
            },
            bounds: treeCoverBounds,
            color: '#DB6598',
            labels: []
        },

        legalClass: {
            rootNode: 'legalClasses',
            title: 'Legal Classifications',
            rasterId: '$7',
            bounds: legalClassBounds,
            labels: legalClassLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Legal Classifications since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Legal Classifications',
                removeBelowYear: 2005
            },
            colors: legalClassColors,
            fireKey: 'legalClass' // Key to the Fires Config for items related to this
        },

        indonesiaMoratorium: {
            rootNode: 'indoMoratorium',
            title: 'Indonesia Moratorium',
            rasterId: '$522',
            formaId: '$14',
            bounds: moratoriumBounds,
            labels: moratoriumLabels,
            clearanceChart: {
                title: 'Clearance alerts on Moratorium Areas since Jan 2015',
                type: 'bar'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Indonesia Moratorium',
                removeBelowYear: 2011
            },
            colors: moratoriumColors,
            fireKey: 'indonesiaMoratorium',
            compositionAnalysis: {
                rasterId: 522,
                histogramSlice: 1
            }
        },

        prodes: {
            rootNode: 'prodes',
            title: 'Prodes Deforestation',
            rasterId: '$555',
            // formaId: '$14',
            bounds: prodesBounds,
            labels: prodesLabels,
            mosaicRule: {
                'mosaicMethod': 'esriMosaicLockRaster',
                'lockRasterIds': [555],
                'ascending': true,
                'mosaicOperation': 'MT_FIRST'
            },
            clearanceChart: {
                title: 'PRODES',
                type: 'bar'
            },
            lossChart: {
                title: 'PRODES'//,
                //removeBelowYear: 2001
            },
            colors: prodesColors,
            fireKey: 'prodes',
            compositionAnalysis: {
                rasterId: 555,
                histogramSlice: 1
            }
        },

        guyra: {
            rootNode: 'guyra',
            title: 'Gran Chaco deforestation',
            rasterId: '$565',
            mosaicRule: {
                'mosaicMethod': 'esriMosaicLockRaster',
                'lockRasterIds': [565],
                'ascending': true,
                'mosaicOperation': 'MT_FIRST'
            },
            lossChart: {
                title: 'Guyra Loss (in hectares)'
            },
            fireKey: 'guyra',
            compositionAnalysis: {
                rasterId: 565,
                histogramSlice: 1
            },
            bounds: guyraBounds,
            color: '#DB6598',
            labels: guyraLabels
        },

        glad: {
            rootNode: 'glad',
            title: 'GLAD Alerts',
            rasterId: ['$6', '$4'],
            url: gladUrl,
            bounds: gladBounds,
            labels: gladLabels,
            // includeFormaIdInRemap: true,
            // formaId: '$15',
            renderingRule: {
              'rasterFunction': 'Local',
              'rasterFunctionArguments': {
                'Operation': 67, //max value; ignores no data
                'Rasters': [{
                  'rasterFunction': 'Remap',
                  'rasterFunctionArguments': {
                    'InputRanges': [0, 150, 150, 366],
                    'OutputValues': [0, 1],
                    'Raster': '$6', //2015
                    'AllowUnmatched': false
                  }
                }, {
                  'rasterFunction': 'Remap',
                  'rasterFunctionArguments': {
                    'InputRanges': [0, 20, 20, 366],
                    'OutputValues': [0, 1],
                    'Raster': '$4', //2016
                    'AllowUnmatched': false
                  }
                }]
              }
            },
            colors: gladColors,
            fireKey: 'glad' // Key to the Fires Config for items related to this
        },

        protectedArea: {
            rootNode: 'protectedAreas',
            title: 'Protected Areas',
            rasterId: '$10',
            bounds: protectedAreaBounds,
            labels: protectedAreaLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Protected Areas since Jan 2015',
                type: 'bar'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Protected Areas'
            },
            compositionAnalysis: {
                rasterId: 10,
                histogramSlice: 1
            },
            colors: protectedAreaColors,
            fireKey: 'protectedArea', // Key to the Fires Config for items related to this
            errors: {
                composition: 'No protected areas detected in this area.'
            }
        },

        carbonStock: {
            rootNode: 'carbonStocks',
            title: 'Aboveground Biomass Density',
            rasterId: '$560', //'$524',
            bounds: carbonStockBounds,
            labels: carbonStockLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Aboveground Biomass Density since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Aboveground Biomass Density (Mg C /Ha)'//,
                // removeBelowYear: 2005
            },
            includeFormaIdInRemap: true,
            formaId: '$28', //'$15',
            rasterRemap: {
                'rasterFunction': 'Remap',
                'rasterFunctionArguments': {
                    'InputRanges': [0, 101, 101, 201, 201, 301, 301, 401, 401, 501, 501, 1000], //[1, 20, 20, 80, 80, 370],
                    'OutputValues': [1, 2, 3, 4, 5, 6],
                    'Raster': '$560',
                    'AllowUnmatched': false
                },
                'outputPixelType': 'U8'
            },
            colors: carbonStockColors,
            fireKey: 'carbonStock' // Key to the Fires Config for items related to this
        },

        plantationsTypeLayer: {
            rootNode: 'plantationsTypeLayer',
            title: 'Plantations by Type',
            rasterId: '$558',
            bounds: plantationsTypeBounds,
            labels: plantationsTypeLabels,
            clearanceChart: {
                title: 'Plantations by Type',
                type: 'pie'
            },
            lossChart: {
                title: 'Plantations by Type'
            },
            // includeFormaIdInRemap: false,
            // formaId: '$15',
            colors: plantationsTypeColors,
            fireKey: 'plantationsType' // Key to the Fires Config for items related to this
        },

        plantationsSpeciesLayer: {
            rootNode: 'plantationsSpeciesLayer',
            title: 'Plantations by Species',
            rasterId: '$559',
            bounds: plantationsSpeciesBounds,
            labels: plantationsSpeciesLabels,
            clearanceChart: {
                title: 'Plantations by Species',
                type: 'pie'
            },
            lossChart: {
                title: 'Plantations by Species'
            },
            // includeFormaIdInRemap: false,
            // formaId: '$15', //todo: find the correct ObjectID in http://gis-gfw.wri.org/arcgis/rest/services/commodities/FORMA50_2015/ImageServer
            // rasterRemap: {
            //     'rasterFunction': 'Remap',
            //     'rasterFunctionArguments': { //todo: this, correctly
            //         // 'InputRanges': [1, 20, 20, 80, 80, 370],
            //         // 'OutputValues': [0, 1, 2],
            //         'InputRanges': [13, 13, 2, 2, 8, 8, 1, 1, 4, 4, 5, 5],
            //         'OutputValues': [1, 2, 3, 4, 5, 6],
            //         'Raster': '$559',
            //         'AllowUnmatched': false
            //     }
            // },
            colors: plantationsSpeciesColors,
            fireKey: 'plantationsSpecies' // Key to the Fires Config for items related to this
        },

        brazilBiomes: {
            rootNode: 'brazilBiomes',
            title: 'Brazil Biomes',
            rasterId: '$531',
            bounds: brazilBiomesBounds,
            labels: brazilBiomesLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Brazil Biomes since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Brazil Biomes (Mg C /Ha)',
                removeBelowYear: 2004
            },
            // includeFormaIdInRemap: true,
            formaId: '$21',
            colors: brazilBiomesColors,
            fireKey: 'brazilBiomes' // Key to the Fires Config for items related to this
        },

        intactForest: {
            rootNode: 'intactForestLandscape',
            title: 'Intact Forest Landscapes',
            rasterId: '$9',
            bounds: intactForestBounds,
            labels: intactForestLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Intact Forest Landscapes since Jan 2015',
                type: 'bar'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Intact Forest Landscapes'
            },
            colors: intactForestColors,
            fireKey: 'intactForest', // Key to the Fires Config for items related to this
            errors: {
                composition: 'No intact forest landscapes data available in this area.'
            }
        },

        peatLands: {
            rootNode: 'peatLands',
            title: 'Peat Lands',
            rasterId: '$8',
            bounds: peatLandsBounds,
            labels: peatLandsLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Peat Lands since Jan 2015',
                type: 'bar'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Peat Lands',
                removeBelowYear: 2002
            },
            compositionAnalysis: {
                rasterId: 8,
                histogramSlice: 1
            },
            colors: peatLandsColors,
            fireKey: 'peatLands', // Key to the Fires Config for items related to this
            errors: {
                composition: 'Np peat land detected in this area according to indonesia peat data.'
            }
        },

        landCoverGlobal: {
            rootNode: 'globalLandCover',
            title: 'Land Cover - Global',
            rasterId: '$544', //'$525',
            bounds: lcGlobalBounds,
            labels: lcGlobalLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Land Cover - Global since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Land Cover - Global',
                removeBelowYear: 2004
            },
            // includeFormaIdInRemap: true,
            formaId: '$22',
            colors: lcGlobalColors,
            fireKey: 'landCoverGlobal' // Key to the Fires Config for items related to this
        },
        landCoverAsia: {
            rootNode: 'asiaLandCover',
            title: 'Land Cover - Southeast Asia',
            rasterId: '$4',
            bounds: lcAsiaBounds,
            labels: lcAsiaLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Land Cover - Southeast Asia since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Land Cover - Southeast Asia',
                removeBelowYear: 2005
            },
            colors: lcAsiaColors,
            fireKey: 'landCoverAsia' // Key to the Fires Config for items related to this
        },
        landCoverIndo: {
            rootNode: 'indoLandCover',
            title: 'Land Cover - Indonesia',
            rasterId: '$6',
            bounds: lcIndoBounds,
            labels: lcIndoLabels,
            clearanceChart: {
                title: 'Clearance Alerts on Land Cover - Indonesia since Jan 2015',
                type: 'pie'
            },
            lossChart: {
                title: 'Annual Tree Cover Loss (in hectares) on Land Cover - Indonesia',
                removeBelowYear: 2006
            },
            colors: lcIndoColors,
            fireKey: 'landCoverIndo' // Key to the Fires Config for items related to this
        },


        // If the bounds for the fire queries are different from the bounds on the clearance and loss
        // analysis, specify them below, otherwise, use the same variable as the analysis above
        fires: {
            url: firesQueryUrl,
            primaryForest: {
                type: 'pie',
                field: 'primary_fo',
                labels: primaryForestLabels,
                bounds: primaryForestBounds,
                colors: primaryForestColors,
                title: 'Active Fires in Primary Forests over the past 7 days',
                badgeDesc: 'in primary forests out of'
            },
            treeCover: {
                type: 'pie',
                field: 'treecover',
                labels: treeCoverLabels,
                bounds: [1, 5], // These are different from the bounds used in loss and clearance analysis
                colors: treeCoverColors,
                title: 'Active Fires by Tree Cover Density over the past 7 days',
                badgeDesc: 'on tree cover density out of'
            },
            legalClass: {
                type: 'pie',
                field: 'legal',
                labels: legalClassLabels,
                bounds: legalClassBounds,
                colors: legalClassColors,
                title: 'Active Fires by Legal Classifications over the past 7 days',
                badgeDesc: 'on legal classes out of'
            },
            carbonStock: {
                type: 'pie',
                field: 'carbon',
                labels: carbonStockLabels,
                bounds: carbonStockBounds,
                colors: carbonStockColors,

                title: 'Active Fires by Aboveground Biomass Density over the past 7 days',
                badgeDesc: 'on Aboveground Biomass Density out of'
            },
            plantationsTypeLayer: {
                type: 'pie',
                field: 'plantationsType',
                labels: plantationsTypeLabels,
                bounds: plantationsTypeBounds,
                colors: plantationsTypeColors,
                title: 'Active Fires by Plantations (by Type) over the past 7 days',
                badgeDesc: 'on fires by plantation out of'
            },
            plantationsSpeciesLayer: {
                type: 'pie',
                field: 'plantationsSpecies',
                labels: plantationsSpeciesLabels,
                bounds: plantationsSpeciesBounds,
                colors: plantationsSpeciesColors,
                title: 'Active Fires by Plantations (by Species) over the past 7 days',
                badgeDesc: 'on fires by plantation out of'
            },
            brazilBiomes: {
                type: 'pie',
                field: 'biomes',
                labels: brazilBiomesLabels,
                bounds: brazilBiomesBounds,
                colors: brazilBiomesColors,

                title: 'Active Fires by Brazilian Biomes over the past 7 days',
                badgeDesc: 'on Brazilian Biomes out of'
            },
            protectedArea: {
                type: 'badge',
                field: 'wdpa',
                badgeDesc: 'in protected areas out of'
            },
            intactForest: {
                type: 'badge',
                field: 'ifl',
                badgeDesc: 'on intact forest landscapes out of'
            },
            peatLands: {
                type: 'badge',
                field: 'peat',
                badgeDesc: 'on peat lands out of'
            },
            landCoverGlobal: {
                type: 'pie',
                field: 'lc_global',
                labels: lcGlobalLabels,
                bounds: lcGlobalBounds,
                colors: lcGlobalColors,
                title: 'Active Fires by Land Cover - Global over the past 7 days',
                badgeDesc: 'on land cover global out of'
            },
            landCoverAsia: {
                type: 'pie',
                field: 'lc_seasia',
                labels: lcAsiaLabels,
                bounds: lcAsiaBounds,
                colors: lcAsiaColors,
                title: 'Active Fires by Land Cover - Southeast Asia over the past 7 days',
                badgeDesc: 'on land cover southeast asia out of'
            },
            landCoverIndo: {
                type: 'pie',
                field: 'lc_ind',
                labels: lcIndoLabels,
                bounds: lcIndoBounds,
                colors: lcIndoColors,
                title: 'Active Fires by Land Cover - Indonesia over the past 7 days',
                badgeDesc: 'on land cover indonesia out of'
            },
            indonesiaMoratorium: {
                type: 'badge',
                field: 'moratorium',
                badgeDesc: 'on indonesia moratorium out of'
            },
            prodes: {
                type: 'badge',
                field: 'prodes',
                badgeDesc: 'on Prodes out of'
            },
            plantationsType: {
                type: 'badge',
                field: 'plantationsType',
                badgeDesc: 'on Plantations Type out of'
            },
            plantationsSpecies: {
                type: 'badge',
                field: 'plantationsSpecies',
                badgeDesc: 'on Plantations Species out of'
            }
        },

        /**
        * This contains an array of labels and keys, these are in the order the columns should appear
        * If the API response format changes, the keys here must be updated
        */
        millCSVDescriptor: [
          // General categories
          { label: 'Mill Name', info: {
            path: 'mill_name'
          }},
          { label: 'latitude', info: {
            path: 'latitude'
          }},
          { label: 'longitude', info: {
            path: 'longitude'
          }},
          { label: 'priority_risk', info: {
            path: 'priority_level'
          }},
          { label: 'total_historic_risk', info: {
            path: 'historic_loss'
          }},
          { label: 'total_future_risk', info: {
            path: 'future_risk'
          }},
          // Combined values
          { label: 'combined_tree_loss_risk', info: {
            path: 'tree_cover.risk'
          }},
          { label: 'combined_primary_forest_risk', info: {
            path: 'primary_forest.risk'
          }},
          { label: 'combined_peat_risk', info: {
            path: 'peat.risk'
          }},
          { label: 'combined_protected_risk', info: {
            path: 'protected_areas.risk'
          }},
          { label: 'combined_carbon_dense_area_risk', info: {
            path: 'carbon.risk'
          }},
          { label: 'combined_fires_risk', info: {
            path: 'fire.risk'
          }},
          // Historic data
          { label: 'historic_tree_loss_risk', info: {
            path: 'tree_cover.loss.rank'
          }},
          { label: 'historic_tree_loss_value (ha/year)', info: {
            path: 'tree_cover.loss.amount',
            precision: 0
          }},
          { label: 'historic_primary_forest_risk', info: {
            path: 'primary_forest.loss.rank'
          }},
          { label: 'historic_primary_forest_value (ha)', info: {
            path: 'primary_forest.loss.amount',
            precision: 0
          }},
          { label: 'historic_peat_risk', info: {
            path: 'peat.loss.rank'
          }},
          { label: 'historic_peat_value (ha)', info: {
            path: 'peat.loss.amount',
            precision: 0
          }},
          { label: 'historic_protected_risk', info: {
            path: 'protected_areas.loss.rank'
          }},
          { label: 'historic_protected_value (ha)', info: {
            path: 'protected_areas.loss.amount',
            precision: 0
          }},
          { label: 'historic_carbon_dense_area_risk', info: {
            path: 'carbon.loss.rank'
          }},
          { label: 'historic_carbon_dense_area_value (ha)', info: {
            path: 'carbon.loss.amount',
            precision: 0
          }},
          { label: 'historic_fires_risk', info: {
            path: 'fire.loss.rank'
          }},
          { label: 'historic_fires_value (fires/ha/year)', info: {
            path: 'fire.loss.amount',
            precision: 5
          }},
          // Future data
          { label: 'future_tree_loss_risk', info: {
            path: 'tree_cover.extent.rank'
          }},
          { label: 'future_tree_loss_value (ha/year)', info: {
            path: 'tree_cover.extent.amount',
            precision: 0
          }},
          { label: 'future_primary_forest_risk', info: {
            path: 'primary_forest.extent.rank'
          }},
          { label: 'future_primary_forest_value (%)', info: {
            path: 'primary_forest.extent.amount',
            precision: 0
          }},
          { label: 'future_peat_risk', info: {
            path: 'peat.extent.rank'
          }},
          { label: 'future_peat_value (%)', info: {
            path: 'peat.extent.amount',
            precision: 0
          }},
          { label: 'future_protected_risk', info: {
            path: 'protected_areas.extent.rank'
          }},
          { label: 'future_protected_value (%)', info: {
            path: 'protected_areas.extent.amount',
            precision: 0
          }},
          { label: 'future_carbon_dense_area_risk', info: {
            path: 'carbon.extent.rank'
          }},
          { label: 'future_high_carbon_value (%)', info: {
            path: 'carbon.extent.amount',
            precision: 0
          }},
          { label: 'future_fires_risk', info: {
            path: 'fire.extent.rank'
          }},
          { label: 'future_fires_value (fires/ha/year)', info: {
            path: 'fire.extent.amount',
            precision: 5
          }}
        ]

    };

});
