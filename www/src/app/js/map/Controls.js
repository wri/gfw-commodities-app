define([
    "dojo/dom",
    "dojo/query",
    "dojo/Deferred",
    "dojo/_base/fx",
    "dojo/_base/array",
    "dojo/dom-class",
    "dojo/dom-style",
    "dijit/registry",
    "dojo/dom-construct",
    "utils/Hasher",
    "map/config",
    "map/MapModel",
    "map/LossSlider",
    "map/FormaSlider",
    "map/LayerController",
    "esri/request",
    "esri/TimeExtent",
    "esri/dijit/TimeSlider",
    "dijit/form/CheckBox",
    "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer"
], function(dom, dojoQuery, Deferred, Fx, arrayUtils, domClass, domStyle, registry, domConstruct, Hasher, MapConfig, MapModel, LossSlider, FormaSlider, LayerController, request, TimeExtent, TimeSlider, Checkbox, ContentPane, Accordion) {

    'use strict';

    var jq171 = jQuery.noConflict(),
        sliderInit = false,
        sliderInit2 = false;

    return {

        toggleToolbox: function(layerConfig, operation) {
            if (layerConfig.id === 'CustomSuitability') {
                // Toggle This checkbox independent of other toolboxes
                var display = (operation === 'show' ? 'block' : 'none');
                domStyle.set(layerConfig.toolsNode, 'display', display);
                // Resize the Accordion and The JQuery Sliders so they look correct
                // registry.byId('suitability-accordion').resize();
                this.resizeRangeSliders();
            } else {
                // Hide other tools, then show this node if operation is show
                this.hideAllToolboxes();
                if (operation === 'show') {
                    domStyle.set(layerConfig.toolsNode, 'display', 'block');
                }
            }
        },

        hideAllToolboxes: function() {
            dojoQuery(".gfw .layer-controls-container .toolbox").forEach(function(node) {
                if (domStyle.get(node, 'display') === "block") {
                    domStyle.set(node, 'display', 'none');
                }
            });
        },

        createDialogBox: function(content) {
            require([
                "dijit/Dialog",
                "dojo/_base/lang"
            ], function(Dialog, Lang) {

                var contentClone = Lang.clone(content);
                var node = contentClone.querySelector(".source_body");

                if (node.querySelector(".source_extended")) {
                    node.removeChild(node.querySelector(".source_extended"));
                }
                if (node.querySelector(".source_download")) {
                    node.removeChild(node.querySelector(".source_download"));
                }
                if (node.querySelector(".overview_title")) {
                    node.querySelector(".source_summary").removeChild(node.querySelector(".overview_title"));
                }
                if (contentClone.querySelector(".source_header")) {
                    contentClone.removeChild(contentClone.querySelector(".source_header"));

                }
                //remove checkbox

                if (contentClone.getElementsByTagName("input").length) {
                    contentClone.removeChild(contentClone.getElementsByTagName("input")[0]);

                }

                var dialog = new Dialog({
                    // title: content.querySelector(".source_title").innerHTML.toUpperCase(),
                    title: content.querySelector(".source_title").innerHTML,
                    style: "height: 600px; width: 600px; overflow-y: auto;",
                    draggable: false,
                    hide: function() {
                        dialog.destroy();
                    }
                });



                dialog.onClose(function() {
                    //console.log("CLOSED");
                });
                //for possible title
                //content.getElementsByClassName("source_title")[0].innerHTML
                dialog.setContent(contentClone.innerHTML);
                dialog.show();

                $('body').on('click',function(e){
                    if (e.target.classList.contains('dijitDialogUnderlay')) {
                        dialog.hide();
                        $('body').off('click');
                    }
                });

            });
        },

        showFiresConfidenceInfo: function(evt) {
            var _self = this;
            require([
                "dijit/Dialog",
                "dojo/on",
                "dojo/_base/lang"
            ], function(Dialog, on, Lang) {
                //Export Dialog
                //TODO: Move this HTML into one of the template files.
                var content = "<p>" + MapConfig.firesConfidenceDialog.text + "</p>";

                var dialog = new Dialog({
                    title: MapConfig.firesConfidenceDialog.title.toUpperCase(),
                    style: "height: 310px; width: 415px; font-size:14px; padding: 5px;",
                    draggable: false,
                    hide: function() {
                        dialog.destroy();
                    }
                });
                dialog.setContent(content);
                dialog.show();

                $('body').on('click',function(e){
                    if (e.target.classList.contains('dijitDialogUnderlay')) {
                        dialog.hide();
                        $('body').off('click');
                    }
                });

            });
        },

        toggleFiresLayerOptions: function(evt) {
            var target = evt.target ? evt.target : evt.srcElement,
                filter = target.dataset ? target.dataset.filter : target.getAttribute('data-filter'),
                highConfidence;
            // Remove selected class from previous selection
            dojoQuery(".fires_toolbox .toolbox-list li").forEach(function(node) {
                domClass.remove(node, "selected");
            });
            // Add selected class to new selection
            domClass.add(target, "selected");

            // Get status of high confidence fires checkbox
            highConfidence = dom.byId("high-confidence").checked;

            LayerController.setFiresLayerDefinition(filter, highConfidence);
        },

        toggleFiresConfidenceLevel: function(evt) {
            var target = evt.target ? evt.target : evt.srcElement,
                highConfidence = target.checked,
                element,
                filter;

            // Find the currently active filter
            element = dojoQuery(".fires_toolbox .toolbox-list li.selected")[0];
            filter = element.dataset ? element.dataset.filter : element.getAttribute("data-filter");

            LayerController.setFiresLayerDefinition(filter, highConfidence);

        },

        // this function should also have the ability to handle string (dom node id's) to turn these on
        toggleOverlays: function(evt, nodeId) {
            if (evt) {
                domClass.toggle(evt.currentTarget, 'selected');
            } else if (nodeId) {
                // May Extend this to take an array so if 4 nodes need to be updated, I dont update the layer 4 times
                // instead, toggle all the classes and then update the layer, in this case, nodeId would be an array
                domClass.toggle(dom.byId(nodeId), 'selected');
            }

            LayerController.setOverlaysVisibleLayers();
        },

        generateTimeSliders: function() {
            LossSlider.init();
            FormaSlider.init();
        },



        // fetchFORMAAlertsLabels: function() {
        //     var deferred = new Deferred(),
        //         req;
        //
        //     req = request({
        //         url: MapConfig.forma.url,
        //         content: {
        //             "f": "pjson"
        //         },
        //         handleAs: "json",
        //         callbackParamName: "callback"
        //     });
        //
        //     req.then(function(res) {
        //         deferred.resolve(res);
        //     }, function(err) {
        //         //console.error(err);
        //         deferred.resolve(false);
        //     });
        //
        //     return deferred.promise;
        // },

        toggleLegendContainer: function() {
            var node = dom.byId("legend-container"),
                height = node.offsetHeight === 280 ? 30 : 280;

            Fx.animateProperty({
                node: node,
                properties: {
                    height: height
                },
                duration: 500,
                onEnd: function() {
                    if (height === 30) {
                        domClass.add("legend-title", "closed");
                    } else {
                        domClass.remove("legend-title", "closed");
                    }
                }
            }).play();
        },

        generateSuitabilitySliders: function() {

            //var accordion = new Accordion({}, "suitability-accordion"),
            //var	self = this;

            // accordion.addChild(new ContentPane({
            // 	title: "Environmental"
            // }, "environmental-criteria"));

            // accordion.addChild(new ContentPane({
            // 	title: "Crop"
            // }, "crop-criteria"));

            // accordion.startup();
            this.createCheckboxDijits();
            this.createRangeSliders();

            // Listen for the accordion to change, then resize the sliders
            // accordion.watch('selectedChildWidget', function (name, oldVal, newVal) {
            // 	self.resizeRangeSliders();
            // });
        },

        createCheckboxDijits: function() {
            var checkbox;
            arrayUtils.forEach(MapConfig.checkboxItems, function(item) {
                checkbox = new Checkbox({
                    name: item.name,
                    value: item.value,
                    checked: item.checked,
                    onChange: function() {
                        LayerController.updateCustomSuitabilityLayer(null, item.name);
                    }
                }, item.node);
            });
        },

        createRangeSliders: function() {
            var sliderConfig = MapConfig.suitabilitySliderTooltips;
            // jQuery Shim To Allow Older Plugin to Work Correctly with new Version of JQuery
            jQuery.browser = {};
            (function() {
                jQuery.browser.msie = false;
                jQuery.browser.version = 0;
                if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
                    jQuery.browser.msie = true;
                    jQuery.browser.version = RegExp.$1;
                }
            })();
            // Peat Depth
            jq171("#peat-depth-slider").rangeSlider({
                defaultValues: {
                    min: 0,
                    max: 3
                },
                valueLabels: 'change',
                bounds: {
                    min: 0,
                    max: 3
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return sliderConfig.peat[val];
                }
            });
            jq171("#peat-depth-slider").addClass("singleValueSlider reverseSlider");
            jq171("#peat-depth-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(data.values.min, 'peat-depth-slider');
            });
            // Conservation Area Buffers
            jq171("#conservation-area-slider").rangeSlider({
                defaultValues: {
                    min: 1000,
                    max: 5000
                },
                valueLabels: 'change',
                bounds: {
                    min: 500,
                    max: 5000
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return val + " m";
                }
            });
            jq171("#conservation-area-slider").addClass("singleValueSlider");
            jq171("#conservation-area-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(data.values.min, 'conservation-area-slider');
            });
            // Water Resource Buffers
            jq171("#water-resource-slider").rangeSlider({
                defaultValues: {
                    min: 100,
                    max: 1000
                },
                valueLabels: 'change',
                bounds: {
                    min: 50,
                    max: 1000
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return val + " m";
                }
            });
            jq171("#water-resource-slider").addClass("singleValueSlider");
            jq171("#water-resource-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(data.values.min, 'water-resource-slider');
            });
            // Slope
            jq171("#slope-slider").rangeSlider({
                defaultValues: {
                    min: 30,
                    max: 80
                },
                valueLabels: 'change',
                bounds: {
                    min: 0,
                    max: 80
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return val + "%";
                }
            });
            jq171("#slope-slider").addClass("singleValueSlider reverseSlider");
            jq171("#slope-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(data.values.min, 'slope-slider');
            });
            // Elevation
            jq171("#elevation-slider").rangeSlider({
                defaultValues: {
                    min: 1000,
                    max: 5000
                },
                valueLabels: 'hide',
                bounds: {
                    min: 0,
                    max: 5000
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return val + "m";
                }
            });
            jq171("#elevation-slider").addClass("singleValueSlider reverseSlider");
            jq171("#elevation-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(data.values.min, 'elevation-slider');
            });
            // Rainfall
            jq171("#rainfall-slider").rangeSlider({
                defaultValues: {
                    min: 1500,
                    max: 6000
                },
                valueLabels: 'hide',
                bounds: {
                    min: 1500,
                    max: 6000
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return val + " " + sliderConfig.rainfall.label;
                }
            });
            jq171("#rainfall-slider").addClass("narrowTooltips");
            jq171("#rainfall-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(
                    [data.values.min, data.values.max],
                    'rainfall-slider'
                );
            });
            // Soil Drainage
            jq171("#soil-drainage-slider").rangeSlider({
                defaultValues: {
                    min: 2,
                    max: 4
                },
                valueLabels: 'hide',
                bounds: {
                    min: 1,
                    max: 4
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return sliderConfig.drainage[val];
                }
            });
            jq171("#soil-drainage-slider").addClass("narrowTooltips");
            jq171("#soil-drainage-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(
                    [data.values.min, data.values.max],
                    'soil-drainage-slider'
                );
            });
            // Soil Depth
            jq171("#soil-depth-slider").rangeSlider({
                defaultValues: {
                    min: 3,
                    max: 7
                },
                valueLabels: 'hide',
                bounds: {
                    min: 1,
                    max: 7
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return sliderConfig.depth[val];
                }
            });
            jq171("#soil-depth-slider").addClass("singleValueSlider narrowTooltips");
            jq171("#soil-depth-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(data.values.min, 'soil-depth-slider');
            });
            // Soil Acidity
            jq171("#soil-acid-slider").rangeSlider({
                defaultValues: {
                    min: 1,
                    max: 7
                },
                valueLabels: 'change',
                bounds: {
                    min: 1,
                    max: 8
                },
                step: 1,
                arrows: false,
                formatter: function(val) {
                    return sliderConfig.acidity[val];
                }
            });
            jq171("#soil-acid-slider").addClass("narrowTooltips");
            jq171("#soil-acid-slider").bind('valuesChanged', function(e, data) {
                LayerController.updateCustomSuitabilityLayer(
                    [data.values.min, data.values.max],
                    'soil-acid-slider'
                );
            });
            // Newest Version of Sliders has a css bug, this is a hack to hide it
            // May need to switch to ion sliders instead in future and remove older version
            // of jQuery
            dojoQuery('.ui-rangeSlider-innerBar').forEach(function(node) {
                domConstruct.create('div', {
                    'class': 'slider-bar-blocker'
                }, node, 'after');
            });

        },

        resetSuitabilitySettings: function() {
            // Reset Sliders
            jq171('#peat-depth-slider').rangeSlider('values', 0, 3);
            jq171('#conservation-area-slider').rangeSlider('values', 1000, 5000);
            jq171('#water-resource-slider').rangeSlider('values', 100, 1000);
            jq171('#slope-slider').rangeSlider('values', 30, 80);
            jq171('#elevation-slider').rangeSlider('values', 1000, 5000);
            jq171('#rainfall-slider').rangeSlider('values', 1500, 6000);
            jq171('#soil-drainage-slider').rangeSlider('values', 2, 4);
            jq171('#soil-depth-slider').rangeSlider('values', 3, 7);
            jq171('#soil-acid-slider').rangeSlider('values', 1, 7);
            this.resizeRangeSliders();
            // Reset Checkboxes
            var cb;
            arrayUtils.forEach(MapConfig.checkboxItems, function(item) {
                cb = registry.byId(item.node);
                if (cb) {
                    cb.set('checked', item.checked);
                }
            });
        },

        exportSuitabilitySettings: function() {
            var _self = this;
            require([
                "dijit/Dialog",
                "dojo/on",
                "dojo/_base/lang"
            ], function(Dialog, on, Lang) {
                //Export Dialog
                //TODO: Move this HTML into one of the template files.
                var content = "<p>" + MapConfig.suitabilityExportDialog.instruction + "</p>";
                content += "<p id='export-error-message' style='color: #e50036;font-size: 12px;'></p>";
                content += "<div id='export-loading-now' class='submit-container' style='display: none; visibility: hidden;'><div class='loading-wheel-container'><div class='loading-wheel'></div></div></div>"
                content += "<div id='export-buttons-container' class='submit-container'>";
                content += "<button id='export-cancel-now'>Cancel</button> ";
                content += "<button id='export-download-now'>Download</button>";
                content += "</div>";

                var dialog = new Dialog({
                    title: MapConfig.suitabilityExportDialog.title.toUpperCase(),
                    style: "height: 190px; width: 415px; overflow-y: none;",
                    draggable: false,
                    hide: function() {
                        dialog.destroy();
                    }
                });
                dialog.setContent(content);
                dialog.show();

                on(dom.byId("export-cancel-now"), 'click', function() {
                    dialog.destroy();
                });
                on(dom.byId("export-download-now"), 'click', function() {
                    //Export CSV
                    var text = _self._getSettingsCSV();
                    var blob = new Blob([text], {
                        type: "text/csv;charset=utf-8;"
                    });
                    saveAs(blob, "settings.csv");

                    //dom.byId("export-error-message").innerHTML = "";
                    domStyle.set(dom.byId("export-buttons-container"), 'visibility', 'hidden');
                    domStyle.set(dom.byId("export-loading-now"), 'visibility', 'visible');
                    domStyle.set(dom.byId("export-loading-now"), 'display', 'block');

                    //Export GeoTIFF
                    _self._saveTIFF(function(errorMsg) {
                        console.log("**callback** (error = " + errorMsg + ")");
                        //domStyle.set(dom.byId("export-buttons-container"), 'visibility','visible');
                        domStyle.set(dom.byId("export-loading-now"), 'visibility', 'hidden');
                        domStyle.set(dom.byId("export-loading-now"), 'display', 'none');
                        if (errorMsg == "") {
                            //Close pop-up
                            dialog.destroy();
                        } else {
                            dom.byId("export-error-message").innerHTML = errorMsg;
                        }
                    });

                });
            });
        },

        _saveTIFF: function(callback) {
            var _self = this;
            var ext = app.map.extent;
            var width = 1460;
            var height = 854;
            var params = {
                noData: 0,
                noDataInterpretation: "esriNoDataMatchAny",
                interpolation: "RSP_BilinearInterpolation",
                format: "tiff",
                size: width + "," + height,
                imageSR: 3857,
                bboxSR: 3857,
                f: "json",
                pixelType: 'UNKNOWN'
            };
            //console.log("params", params);

            var exporter = function(url, content) {
                console.log("exporter() :: url = ", url);
                window.open(url, "geoTiffWin");
                callback("");
                /*
                var layersRequest = request({
                    url: url,
                    content: content,
                    handleAs: "json",
                    callbackParamName: "callback"
                });
                layersRequest.then(
                    function (response) {
                        console.log(response);
                        window.open(response.href, "geoTiffWin");
                        callback("");
                    }, function (error) {
                        console.log("Error: ", error.message);
                        callback(error.message);
                    });
                /**/
                /*
                $.ajax({
                    url: url,
                    //data: myData,
                    type: 'GET',
                    crossDomain: true,
                    dataType: 'jsonp',
                     success: function() {
                         alert("Success");
                         callback("");
                     },
                     error: function(jqXHR, errorMessage) {
                         alert('Failed!');
                         console.log("ERROR: ", errorMessage);
                         callback(errorMessage);
                     } //,
                    // beforeSend: setHeader
                });
                */
            };

            var layerID = MapConfig.suit.id;
            //console.log(" :: layerID = " + layerID);
            app.map.getLayer(layerID).getImageUrl(app.map.extent, width, height, exporter, params);
            /*
            var _self = this;
            require(["esri/request", "mapui", "mainmodel", "dialog", "resources", "on"],
                function (esriRequest, MapUI, MainModel, Dialog, Resources, on) {
                    function exporter(url, content) {
                        var layersRequest = esriRequest({
                            url: url,
                            content: content,
                            handleAs: "json",
                            callbackParamName: "callback"
                        });
                        layersRequest.then(
                            function (response) {
                                // dlg is the dialog created below
                                dlg.hide();
                                window.open(response.href, "newWin");

                            }, function (error) {
                                console.log("Error: ", error.message);
                            });
                        //xmlhttp.open("POST", result, true);
                        //xmlhttp.send();
                    }
                    var map = MapUI.getMap();
                    var ext = map.extent;
                    var width = 1460;
                    var height = 854;
                    var bbox =
                    {
                        xmax: ext.xmax,
                        xmin: ext.xmin,
                        ymax: ext.ymax,
                        ymin: ext.ymin
                    };
                    var params = {
                        noData: 0,
                        noDataInterpretation: "esriNoDataMatchAny",
                        interpolation: "RSP_BilinearInterpolation",
                        format: "tiff",
                        size: width + "," + height,
                        imageSR: 3857,
                        bboxSR: 3857,
                        f: "json",
                        pixelType: 'UNKNOWN'
                    };

                    var resources = Resources(),
                        content = resources.en.exportSuitImageContent,
                        title = resources.en.exportSuitImage;

                    var dlg = registry.byId("exportMapDialog");
                    dlg.set("title", title);
                    dlg.set("style", "width: 300px;");
                    dom.byId("exportMapDialogContent").innerHTML = content;
                    dlg.show();

                    on.once(dom.byId("exportOK"), "click", function () {
                        var sl = map.getLayer(toolsconfig.getConfig().suitabilityImageServiceLayer.id).getImageUrl(map.extent,
                            width, height, exporter, params);
                        //_self.exportSuitText();
                    });

                    on.once(dom.byId("exportCancel"), "click", function () {
                        dlg.hide();
                    });

                    //bbox['spatialReference'] = { 'wkid': 3857 };
                    //_self.computeSuitHistogram("PalmOilSuitability_Histogram", bbox, "esriGeometryEnvelope");
                });
            */
        },

        _getSettingsCSV: function() {
            // get slider values & labels (and direction)
            var sliders = ["peat-depth-slider", "conservation-area-slider", "water-resource-slider", "slope-slider", "elevation-slider", "rainfall-slider", "soil-drainage-slider", "soil-depth-slider", "soil-acid-slider"];
            var sliderSelections = "";
            var lbl, vals, bounds, rev, cfg, temp;
            arrayUtils.forEach(sliders, function(sliderName) {
                lbl = dom.byId(sliderName + "-label");
                vals = jq171('#' + sliderName).rangeSlider('values');
                bounds = jq171('#' + sliderName).rangeSlider('bounds');
                rev = domClass.contains(sliderName, "reverseSlider");

                // get tooltips to use for value-labels, if available
                temp = sliderName.split("-");
                if (temp[0] != "rainfall") {
                    cfg = MapConfig.suitabilitySliderTooltips[temp[0]];
                    if (cfg == undefined) {
                        if (temp[1] == "acid") temp[1] = "acidity";
                        cfg = MapConfig.suitabilitySliderTooltips[temp[1]];
                    }
                }

                if (sliderSelections != "") sliderSelections += "\n";
                sliderSelections += lbl.innerHTML + ",";
                if (rev) {
                    if (cfg == undefined) {
                        sliderSelections += bounds.min + "-" + vals.min;
                    } else {
                        var tempList = "";
                        for (var i = bounds.min; i <= vals.min; ++i) {
                            if (tempList != "") tempList += "; ";
                            tempList += cfg[i].replace(",", "/");
                        }
                        sliderSelections += tempList;
                    }
                } else {
                    if (cfg == undefined) {
                        sliderSelections += vals.min + "-" + vals.max;
                    } else {
                        var tempList = "";
                        for (var i = vals.min; i <= vals.max; ++i) {
                            if (tempList != "") tempList += "; ";
                            tempList += cfg[i].replace(",", "/");
                        }
                        sliderSelections += tempList;
                    }
                }
            });

            // get value-labels for selected checkboxes
            var landCoverSelection = "";
            var soilTypeSelection = "";
            var cb;
            arrayUtils.forEach(MapConfig.checkboxItems, function(item) {
                cb = registry.byId(item.node);
                if (cb && cb.get('checked')) {
                    lbl = dojoQuery("label[for='" + item.node + "']")[0];
                    //console.log(" :: chb '" + item.node + "': checked? " + cb.get('checked'));
                    //console.log(" :::: LABEL:", lbl);
                    if (item.name == "landcover-checkbox") {
                        if (landCoverSelection != "") landCoverSelection += "; ";
                        landCoverSelection += lbl.innerHTML;
                    } else if (item.name == "soil-type-checkbox") {
                        if (soilTypeSelection != "") soilTypeSelection += "; ";
                        soilTypeSelection += lbl.innerHTML;
                    }
                }
            });

            //composite CSV
            var fields = ['Suitability Parameter', 'Suitability Values'];
            var csvStr = fields.join(",") + '\n';
            csvStr += sliderSelections + "\n";
            csvStr += "Land Cover," + landCoverSelection + "\n";
            csvStr += "Soil Type," + soilTypeSelection + "\n";

            return csvStr;
        },

        resizeRangeSliders: function() {
            /* Do the Following for Each Slider
			 - Hide the labels
			 - resize the slider
			 - reactivate the listeners to show labels
			*/
            jq171("#peat-depth-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#conservation-area-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#water-resource-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#slope-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#elevation-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#rainfall-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#soil-drainage-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#soil-depth-slider").rangeSlider('option', 'valueLabels', 'hide');
            jq171("#soil-acid-slider").rangeSlider('option', 'valueLabels', 'hide');

            jq171("#peat-depth-slider").rangeSlider('resize');
            jq171("#conservation-area-slider").rangeSlider('resize');
            jq171("#water-resource-slider").rangeSlider('resize');
            jq171("#slope-slider").rangeSlider('resize');
            jq171("#elevation-slider").rangeSlider('resize');
            jq171("#rainfall-slider").rangeSlider('resize');
            jq171("#soil-drainage-slider").rangeSlider('resize');
            jq171("#soil-depth-slider").rangeSlider('resize');
            jq171("#soil-acid-slider").rangeSlider('resize');

            jq171("#peat-depth-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#conservation-area-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#water-resource-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#slope-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#elevation-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#rainfall-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#soil-drainage-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#soil-depth-slider").rangeSlider('option', 'valueLabels', 'change');
            jq171("#soil-acid-slider").rangeSlider('option', 'valueLabels', 'change');

        },

        serializeSuitabilitySettings: function() {
            return {
                'Peat Depth': jq171("#peat-depth-slider").rangeSlider('values').min,
                'Conservation Area': jq171("#conservation-area-slider").rangeSlider('values').min,
                'Water Resource': jq171("#water-resource-slider").rangeSlider('values').min,
                'Slope': jq171("#slope-slider").rangeSlider('values').min,
                'Elevation': jq171("#elevation-slider").rangeSlider('values').min,
                'Rainfall': jq171("#rainfall-slider").rangeSlider('values'),
                'Soil Drainage': jq171("#soil-drainage-slider").rangeSlider('values'),
                'Soil Depth': jq171("#soil-depth-slider").rangeSlider('values').min,
                'Soil Acidity': jq171("#soil-acid-slider").rangeSlider('values'),
                'Shrub': registry.byId('shrub-check').checked,
                'Bareland': registry.byId('bareland-check').checked,
                'Secondary Forest': registry.byId('secondary-forest-check').checked,
                'Dryland Agriculture mixed with shrub': registry.byId('dryland-agro-check').checked,
                'Water Body': registry.byId('water-check').checked,
                'Mining': registry.byId('mining-check').checked,
                'Plantation Forest': registry.byId('plantation-forest-check').checked,
                'Estate Crop Plantation': registry.byId('estate-crop-check').checked,
                'Swamp shrub': registry.byId('swamp-shrub-check').checked,
                'Primary swamp Forest': registry.byId('primary-swamp-check').checked,
                'Secondary swamp Forest': registry.byId('secondary-swamp-check').checked,
                'Settlement': registry.byId('settlement-check').checked,
                'Grassland': registry.byId('grassland-check').checked,
                'Secondary mangrove forest': registry.byId('secondary-mangrove-check').checked,
                'Dryland agriculture': registry.byId('dryland-check').checked,
                'Rice field': registry.byId('rice-check').checked,
                'Fish pond': registry.byId('fish-check').checked,
                'Transmigration area': registry.byId('transmigration-check').checked,
                'Swamp': registry.byId('swamp-check').checked,
                'Primary mangrove swamp': registry.byId('primary-mangrove-check').checked,
                'Airport': registry.byId('airport-check').checked,
                'Inceptisol': registry.byId('inceptisol-check').checked,
                'Oxisol': registry.byId('oxisol-check').checked,
                'Alfisol': registry.byId('alfisol-check').checked,
                'Ultisol': registry.byId('ultisol-check').checked,
                'Spodosol': registry.byId('spodosol-check').checked,
                'Entisol': registry.byId('entisol-check').checked,
                'Histosol': registry.byId('histosol-check').checked,
                'Mollisol': registry.byId('mollisol-check').checked,
                'Rock': registry.byId('rock-check').checked
            };
        }

    };

});
