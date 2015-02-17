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
    "map/LayerController",
    "esri/request",
    "esri/TimeExtent",

    "esri/dijit/TimeSlider",
    "dijit/form/CheckBox",
    "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer"
], function(dom, dojoQuery, Deferred, Fx, arrayUtils, domClass, domStyle, registry, domConstruct, Hasher, MapConfig, MapModel, LayerController, request, TimeExtent, TimeSlider, Checkbox, ContentPane, Accordion) {

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
                    title: content.querySelector(".source_title").innerHTML.toUpperCase(),
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
            this.buildFormaSlider();
            this.buildTreeCoverChangeSlider();
            this.newTimeSlider();
        },

        buildFormaSlider: function() {

            var ionCallback = function() {

                var valuesToUse = [];

                var baseYear = 13;
                var currentYear, currentMonth;

                for (var i = 1; i < (to + 2); i++) {
                    currentMonth = (i % 12);
                    if (currentMonth == 0) {
                        currentMonth = 12;
                    }
                    currentYear = Math.floor(((i - 1) / 12) + baseYear);
                    valuesToUse.push(currentMonth + "-" + currentYear);
                    var yearDot = domConstruct.toDom('<div><g class="tick" transform="translate(120,0)" style="opacity: 1;"><line y2="0" x2="0"></line><text y="0" x="0" dy="0em">▪</text></g></div>');
                    domConstruct.place(yearDot, "yearDotContainer");
                    domStyle.get(yearDot);
                    var leftPx = (i * 34.5) + 42.5;
                    leftPx += "px";
                    domStyle.set(yearDot, {
                        "position": "absolute",
                        "left": leftPx,
                    });
                }

                $range2.ionRangeSlider({
                    type: "double",
                    min: min,
                    max: max,
                    from: from,
                    to: to,
                    playing: false,
                    prettify: false,
                    values: valuesToUse,
                    onChange: function(data) {
                        //console.log(data);
                        from = data.fromNumber;
                        to = data.toNumber;
                        updateValues();
                        $(".irs-single").hide();
                        if (from == to) {
                            $(".irs-single").hide();
                            $(".irs-to").show();
                        }

                        if (from == (data.max - 1) && to == data.max) {
                            $(".irs-single").hide();
                            $(".irs-from").show();
                        }
                        if (to == data.max && from != data.max) {
                            $(".irs-diapason").css("width", "+=7px");
                        }
                        if (to == data.max && from == data.max) {
                            $(".irs-diapason").css("width", "-=8px");
                        }

                        $("#yearDotContainer > div:nth-child(13)").css("color", "black");
                        $("#range2").ionRangeSlider("update");
                        if ($range2.playing != true) {
                            $("#sliderProgressLine2").hide();
                            $("#playLine3").hide();
                            var values3 = [from, to];
                            for (var i = 1; i < (data.max + 2); i++) {
                                var item2 = $("#yearDotContainer > div:nth-child(" + i + ")");

                                if ((i < from + 1) || (i > to)) {
                                    $(item2.selector).css("color", "grey");
                                    $("#yearDotContainer > div:nth-child(1)").css("color", "black");

                                } else {
                                    $(item2.selector).css("color", "#a1ba42");
                                }
                                if (from > 12 || to < 12) {
                                    $("#yearDotContainer > div:nth-child(13)").css("color", "black");
                                }
                                if (from == 1 && to == (data.max - 1)) {
                                    $("#yearDotContainer > div:nth-child(1)").css("color", "black");
                                }
                            }
                            LayerController.updateImageServiceRasterFunction(values3, MapConfig.forma);
                        }
                    },
                });

                $(".irs-slider.to").css("left", "790px");
                $(".slider-container").show();
                $("#formaAlertSlider").each(function() {
                    var node = this;
                    var sliderProgressLine2 = domConstruct.create("div", {
                        id: "sliderProgressLine2"
                    });
                    domConstruct.place(sliderProgressLine2, node, "after");

                    var playLine3 = domConstruct.create("div", {
                        id: "playLine3"
                    });
                    domConstruct.place(playLine3, node, "after");
                });

                $(".irs-single").hide();

                var sliderFrom = parseInt($("#irs-2 > span.irs > span.irs-from").css('left'));
                var sliderFrom2 = parseInt($("#irs-2 > span.irs > span.irs-slider.from.last").css('left'));

                var sliderDiff = 790 - sliderFrom2;
                if (isNaN(sliderFrom2) === true) {
                    sliderDiff = 790 - sliderFrom;
                }

                $(".irs-diapason").css("width", sliderDiff + "px");
                // $("#irs-2 > span.irs > span.irs-slider.from.last").css("left", "0px");
                // $("#irs-2 > span.irs > span.irs-from").css("left", "0px");
                // $("#irs-2 > span.irs > span.irs-from").html("1-13");
                // $(".irs-diapason").css("width", "790px");
                $(".irs-diapason").css("background-color", "#a1ba42");
                $("#yearDotContainer > div").css("color", "#a1ba42");
                var nextYearLeft = $("#yearDotContainer > div:nth-child(13)").css("left");
                // nextYearLeft = nextYearLeft.split("p");
                // nextYearLeft = (nextYearLeft[0] - 50) + "px";
                // console.log(nextYearLeft);
                $(".playLineFiller2 > div:nth-child(2)").css("left", nextYearLeft);



            }

            var layerArray = Hasher.getLayers(),
                active = layerArray.indexOf("forma") > -1;

            $(".extra-controls2 #newSlider2").click(function() {
                play();
            });
            var $range2 = $(".gfw .toolbox .slider-container"),
                $from = $(".js-from"),
                $to = $(".js-to"),
                min = "1-13",
                max,
                from = "0",
                to;

            var incrementer = 0,
                baseYear = 13,
                labels3 = [],
                month;
            this.fetchFORMAAlertsLabels().then(function(res) {
                if (res) {
                    to = res.maxValues[0] - res.minValues[0];
                    max = (to % 12 + 1) + "-" + (Math.floor(to / 12) + 13);

                    for (var i = res.minValues[0], length = res.maxValues[0]; i <= length; i++) {
                        month = i % 12 === 0 ? 12 : i % 12;
                        if (i % 12 === 0) {
                            ++incrementer;
                        }
                    }
                    var layerArray = Hasher.getLayers(),
                        active = layerArray.indexOf("forma") > -1;
                    if (active) {
                        ionCallback.call();
                    }

                } else {
                    console.log("fetching Forma labels failed!!");
                }
            });

            $("#master-layer-list > div > ul > li:nth-child(2)").click(function() {
                $("#playLine3").hide();
                $("#sliderProgressLine2").hide();
                var $this = $(this);
                setTimeout(function() { //TODO : Fix this 
                    ionCallback.call();
                }, 300);
                $("#irs-2 > span.irs > span.irs-to").css("left", "759px");
                $("#irs-2 > span.irs > span.irs-to").html(max);
            });



            $from.on("change", function() {
                from = $(this).prop("value");
                if (from < min) {
                    from = min;
                }
                if (from > to) {
                    from = to;
                }
                updateValues();
                updateRange();
            });

            $to.on("change", function() {
                to = $(this).prop("value");
                if (to > max) {
                    to = max;
                }
                if (to < from) {
                    to = from;
                }
                updateValues();
                updateRange();
            });

            var updateRange = function() {
                $range2.ionRangeSlider("update", {
                    from: from,
                    to: to
                });
            };

            var updateValues = function() {
                $from.prop("value", from);
                $to.prop("value", to);
            };

            function play() {
                $("#playLine3").hide();
                $('#playLine3').css("left", "0");
                if ($range2.playing === true) {
                    $range2.playing = false;
                    $('#sliderProgressLine2').hide();
                    $("#newSlider2").html("&#9658");
                    return;
                }
                var initialDates = $range2[0].value.split(';');
                var thumbOne = initialDates[0];
                var thumbTwo = initialDates[1];

                var thumbOneInitial = thumbOne;

                var sliderStart3 = $("#irs-2 > span.irs > span.irs-slider.from.last").css("left");
                var sliderStart4 = $("#irs-2 > span.irs > span.irs-diapason").css("left");

                $('#playLine3').css("left", sliderStart3);
                $('#sliderProgressLine2').css("left", sliderStart3);
                if (sliderStart3 === undefined) {
                    $('#playLine3').css("left", sliderStart4);
                    $('#playLine3').css("left", "-=7.5pxpx");
                    $('#sliderProgressLine2').css("left", sliderStart4);
                    $('#sliderProgressLine2').css("left", "-=7.5px");
                }
                $('#playLine3').css("left", "+=53px");
                var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

                var currentMonth = thumbOne % 12;
                var monthDisplay = months[currentMonth];

                $("#playLine3").html(monthDisplay);

                $("#playLine3").show();
                $('#sliderProgressLine2').css("left", "+=82px");

                $("#sliderProgressLine2").show();
                $('#sliderProgressLine2').css('display', 'block');

                if (thumbOne == thumbTwo) {
                    $range2.playing = false;
                    return;
                }
                $range2.playing = true;
                $("#newSlider2").html("&#x25A0");

                var values = [thumbOneInitial, thumbOne];

                values[0] = parseInt(values[0]);
                values[1] = parseInt(values[1]);

                LayerController.updateImageServiceRasterFunction(values, MapConfig.forma);
                var playing = $range2.playing;
                var outer = setTimeout(function() {
                    timeout(from, thumbOne, thumbTwo, values, thumbOneInitial);
                }, 1500);

                function timeout(from, thumbOne, thumbTwo, values, thumbOneInitial) {
                    if ($range2.playing === false) {
                        return;
                    }
                    months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

                    var monthNum = parseInt(thumbOne);
                    currentMonth = (monthNum + 1) % 12;
                    monthDisplay = months[currentMonth];
                    $("#playLine3").html(monthDisplay);
                    $('#playLine3').css("left", "+=34.5px");
                    $('#sliderProgressLine2').css("left", "+=34.5px");

                    var newDates = $range2[0].value.split(';');
                    var newThumbTwo = newDates[1];
                    thumbOne++;
                    values = [thumbOneInitial, thumbOne];
                    values[0] = parseInt(values[0]);
                    values[1] = parseInt(values[1]);

                    LayerController.updateImageServiceRasterFunction(values, MapConfig.forma);

                    if (newThumbTwo > thumbTwo) {
                        thumbTwo = newThumbTwo;
                    }
                    if (thumbOne == thumbTwo || thumbOne == newThumbTwo || thumbOne > newThumbTwo) {
                        $("#newSlider2").html("&#9658");
                        $range2.playing = false;
                        return;
                    }
                    if ($range2.playing == true) {
                        setTimeout(function() {
                            timeout(from, thumbOne, thumbTwo, values, thumbOneInitial);
                        }, 1500);
                    }
                }
            }
        },

        buildTreeCoverChangeSlider: function() {


        },

        newTimeSlider: function() {

            $(".extra-controls #newSlider").click(function() {
                play();
            });

            var $range = $(".js-range-slider"),
                $from = $(".js-from"),
                $to = $(".js-to"),
                min = 2001,
                max = 2013,
                from = 2001,
                to = 2013;

            $(".layer-list-item.forest-change").click(function() {
                var $this = $(this);
                ionCallback.call(this);
                var newLeft = $("#irs-1 > span.irs > span.irs-to").css("left");
                var newLeft2 = newLeft.slice(0, (newLeft.length - 2));
                newLeft2 *= 1;
                if (to == 2013) {
                    $(".irs-slider.to").css("left", "730px");
                } else if ($("#irs-1 > span.irs > span.irs-slider.to.last").css("left") === undefined) {
                    $("#irs-1 > span.irs > span.irs-slider.to").css("left", ((newLeft2 + 8) + 'px'));
                } else {
                    $("#irs-1 > span.irs > span.irs-slider.to.last").css("left", ((newLeft2 + 8) + 'px'));
                }
            });
            $("#master-layer-list > div > ul > li.layer-list-item.forest-change.active > div").click(function() {
                var newLeft = $("#irs-1 > span.irs > span.irs-to").css("left");
                var newLeft2 = newLeft.slice(0, (newLeft.length - 2));
                newLeft2 *= 1;

                if (to == 2013) {
                    $(".irs-slider.to").css("left", "730px");
                } else if ($("#irs-1 > span.irs > span.irs-slider.to.last").css("left") === undefined) {
                    $("#irs-1 > span.irs > span.irs-slider.to").css("left", ((newLeft2 + 8) + 'px'));
                } else {
                    $("#irs-1 > span.irs > span.irs-slider.to.last").css("left", ((newLeft2 + 8) + 'px'));
                }
            });

            var ionCallback = function() {
                $range.ionRangeSlider({
                    type: "double",
                    min: min,
                    max: max,
                    from: from,
                    to: to,
                    playing: false,
                    prettify: false,
                    //values: ["2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013"],
                    onChange: function(data) {
                        from = data.fromNumber;
                        to = data.toNumber;
                        updateValues();
                        if (from == to) {
                            $(".irs-to").show();
                        }
                        $(".irs-single").hide();
                        if ($range.playing !== true) {
                            $("#sliderProgressLine").hide();
                            $("#playLine2").hide();
                            var values3 = [from - 2001, to - 2001];
                            for (var i = 1; i < 13; i++) {
                                var item1 = $(".playLineFiller > div:nth-child(" + i + ")");
                                var item2 = $(".container2 > div:nth-child(" + i + ")");

                                if ((i <= from - 2000) || (i >= to - 2000)) {
                                    $(item1.selector).css("background-color", "transparent");
                                } else {
                                    $(item1.selector).css("background-color", "#a1ba42");
                                }
                                if ((i < from - 1999) || (i > to - 2000)) {
                                    $(item2.selector).css("color", "grey");
                                } else {
                                    $(item2.selector).css("color", "#a1ba42");
                                }
                            }
                            var item3 = $("#irs-1 > span.irs > span.irs-from").css("display");
                            if (item3 === "none") {
                                $(".playLineFiller > div").css("background-color", "#a1ba42");
                            } // TODO: Find a better way to make the bars green on 1st thumb drag when the map is loaded w/ the Forma url & then this slider is turned on
                            if (to != 2013) {
                                $(".container2 > div:nth-child(13)").css("color", "grey");
                            } else {
                                $(".container2 > div:nth-child(13)").css("color", "#a1ba42");
                            }
                            if (to === from) {
                                $(".playLineFiller > div").css("background-color", "transparent");
                            }

                            LayerController.updateImageServiceRasterFunction(values3, MapConfig.loss);
                        }
                    },
                });
                $(".container2 > div:first-child").css("color", "grey");
                $(".container2 > div:last-child").css("color", "grey");
                $("#range").ionRangeSlider("update");
                $("#playLine2").hide();
                $("#sliderProgressLine").hide();
                $(".irs-single").hide();

            };
            if (!sliderInit) {
                sliderInit = true;
                ionCallback();
                $(".irs-diapason").hide();

                $(".irs-diapason").css("background-color", "transparent");
                $(".irs-slider.from.last").each(function() {
                    var node = this;
                    var sliderProgressLine = domConstruct.create("div", {
                        id: "sliderProgressLine"
                    });
                    domConstruct.place(sliderProgressLine, node, "after");

                    var playLine2 = domConstruct.create("div", {
                        id: "playLine2"
                    });
                    domConstruct.place(playLine2, node, "after");
                });
                $(".irs-slider.to").css("left", "730px");

            }

            $from.on("change", function() {
                from = $(this).prop("value");
                if (from < min) {
                    from = min;
                }
                if (from > to) {
                    from = to;
                }
                updateValues();
                updateRange();
            });

            $to.on("change", function() {
                to = $(this).prop("value");
                if (to > max) {
                    to = max;
                }
                if (to < from) {
                    to = from;
                }
                updateValues();
                updateRange();
            });

            var updateRange = function() {
                $range.ionRangeSlider("update", {
                    from: from,
                    to: to
                });
            };

            var updateValues = function() {
                $from.prop("value", from);
                $to.prop("value", to);
            };


            function play() {
                $("#sliderProgressLine").hide();
                $("#playLine2").hide();
                $('#playLine2').css("left", "0");
                $('#sliderProgressLine').css("left", "0");
                if ($range.playing == true) {
                    $range.playing = false;
                    $("#newSlider").html("&#9658");
                    return;
                }
                var initialDates = $range[0].value.split(';');
                var thumbOne = initialDates[0];
                var thumbTwo = initialDates[1];
                var thumbOneInitial = thumbOne;

                var sliderStart = $(".irs-slider.from.last").css("left");
                var sliderStart2 = $("#irs-1 > span.irs > span.irs-slider.from").css("left");

                $('#playLine2').css("left", sliderStart);
                $('#sliderProgressLine').css("left", sliderStart);

                if (sliderStart == undefined || (sliderStart == "0px" && thumbOne != 2001)) {
                    $('#playLine2').css("left", sliderStart2);
                    $('#sliderProgressLine').css("left", sliderStart2);
                }
                $('#playLine2').css("left", "-=21.5px");
                $("#playLine2").html(thumbOne);

                $("#playLine2").show();
                $('#sliderProgressLine').css("left", "+=7.5px");
                $("#sliderProgressLine").show();

                if (thumbOne == thumbTwo) {
                    $range.playing = false;
                    return;
                }

                $range.playing = true;
                $("#newSlider").html("&#x25A0");

                var values = [thumbOneInitial - 2001, thumbOne - 2001];
                values[0] = parseInt(values[0]);
                values[1] = parseInt(values[1]);
                LayerController.updateImageServiceRasterFunction(values, MapConfig.loss);

                var playing = $range.playing;
                var outer = setTimeout(function() {
                    timeout(from, thumbOne, thumbTwo, values, thumbOneInitial);
                }, 1500);

                function timeout(from, thumbOne, thumbTwo, values, thumbOneInitial) {
                    if ($range.playing === false) {
                        return;
                    }

                    $('#playLine2').css("left", "+=61px");
                    $('#sliderProgressLine').css("left", "+=61px");
                    var newDates = $range[0].value.split(';');
                    var newThumbTwo = newDates[1];

                    thumbOne++;
                    $("#playLine2").html(thumbOne);

                    values = [thumbOneInitial - 2001, thumbOne - 2001];

                    LayerController.updateImageServiceRasterFunction(values, MapConfig.loss);

                    if (newThumbTwo > thumbTwo) {
                        thumbTwo = newThumbTwo;
                    }
                    if (thumbOne == thumbTwo || thumbOne == newThumbTwo || thumbOne > newThumbTwo) {
                        if (values[1] - values[0] > 8) {
                            $('#playLine2').css("left", "-=2px");
                            $('#sliderProgressLine').css("left", "-=2px");
                        } else if (values[1] - values[0] > 4) {
                            $('#playLine2').css("left", "-=1x");
                            $('#sliderProgressLine').css("left", "-=1px");
                        }

                        $("#newSlider").html("&#9658");
                        $range.playing = false;
                        return;
                    }
                    if ($range.playing === true) {
                        setTimeout(function() {
                            timeout(from, thumbOne, thumbTwo, values, thumbOneInitial);
                        }, 1500);
                    }
                }
            }
        },


        fetchFORMAAlertsLabels: function() {
            var deferred = new Deferred(),
                req;

            req = request({
                url: MapConfig.forma.url,
                content: {
                    "f": "pjson"
                },
                handleAs: "json",
                callbackParamName: "callback"
            });

            req.then(function(res) {
                deferred.resolve(res);
            }, function(err) {
                //console.error(err);
                deferred.resolve(false);
            });

            return deferred.promise;
        },

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
                //console.log(" :: " + lbl.innerHTML + " (reversed? " + rev + "): ", vals, " :: bounds: ", bounds);

                // get tooltips to use for value-labels, if available
                temp = sliderName.split("-");
                if (temp[0] != "rainfall") {
                    cfg = MapConfig.suitabilitySliderTooltips[temp[0]];
                    if (cfg == undefined) {
                        if (temp[1] == "acid") temp[1] = "acidity";
                        cfg = MapConfig.suitabilitySliderTooltips[temp[1]];
                    }
                }
                //console.log(" :: " + lbl.innerHTML + " :: slider value-labels : ", cfg);

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
            //console.log(" :: LANDCOVER: ", landCoverSelection);
            //console.log(" :: SOIL TYPE: ", soilTypeSelection);

            //composite CSV
            var fields = ['Suitability Parameter', 'Suitability Values'];
            var csvStr = fields.join(",") + '\n';
            csvStr += sliderSelections + "\n";
            csvStr += "Land Cover," + landCoverSelection + "\n";
            csvStr += "Soil Type," + soilTypeSelection + "\n";
            //console.log("----------------------------------------------");
            //console.log(csvStr);
            //console.log("----------------------------------------------");

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

        }

    };

});