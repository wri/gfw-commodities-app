define([
    "dojo/on",
    "dojo/dom",
    "dojo/dom-style",
    "dojo/query",
    "dojo/hash",
    "dojo/dom-class",
    "dojo/io-query",
    "dijit/Dialog",
    "utils/Hasher",
    "main/config",
    "utils/NavListController"
], function(on, dom, domStyle, query, hash, domClass, ioQuery, Dialog, Hasher, AppConfig, NavListController) {
    'use strict';

    var state = 'large', // large, small, or mobile
        initialized = false;

    return {

        init: function(template) {

            if (initialized) {
                return;
            }

            // This is most likely the culprit for why gfw-assets must be loaded in the footer after this content
            // is injected
            dom.byId("app-header").innerHTML = dom.byId("app-header").innerHTML + template;

            this.bindEvents();

            initialized = true;

        },

        setState: function(newState) {
            domClass.remove('app-header', state);
            domClass.add('app-header', newState);
            state = newState;
        },

        bindEvents: function() {
            var self = this;

            query(".header .nav-link").forEach(function(item) {
                on(item, "click", function(evt) {
                    var target = evt.target ? evt.target : evt.srcElement,
                        dataView = target.dataset ? target.dataset.view : target.getAttribute('data-view'),
                        external = target.dataset ? target.dataset.external : target.getAttribute('data-external');

                    self.updateView(dataView, external, initialized);
                });
            });

            query("#dijit_Dialog_0 > div.dijitDialogPaneContent > p > a").forEach(function(item) {
                on(item, "click", function(evt) {
                    var target = evt.target ? evt.target : evt.srcElement,
                        dataView = "map",
                        external = false;
                    //$('#dijit_Dialog_0').dialog("close");
                    //$('#dijit_Dialog_0').close();
                    $("#dijit_Dialog_0 > div.dijitDialogTitleBar > span.dijitDialogCloseIcon").click();
                    self.updateView(dataView, external, initialized);
                });
            });


            query(".nav-link-more").forEach(function(node){
                node.onclick = function (){
                    self.changeNavItemAbout(node, "about");
                };
            });

            var handlerIn = function() {
                $("#learn-more-dropdown").removeClass('hidden');
            }
            var handlerOut = function() {
                $("#learn-more-dropdown").addClass('hidden');
            }

            $("#learnMoreItem").mouseenter(handlerIn).mouseleave(handlerOut);

            setTimeout(function () {
              $("#footerSelecter").click(function() {
                self.addSubscriptionDialog();
              });
              $('.arrow-down-icon').click( function() {
                $('html body').animate({
                  scrollTop: $(".arrow-down-icon").offset().top
                }, 1500);
              });
              $('#get-started__button').click(function () {
                $('#tooltip-getstarted').toggleClass('display');
              });
            }, 200);
        },

        changeNavItemAbout: function(node, context) {
                query(".nav-item-a.selected ").forEach(function(selectedDiv){

                    if(selectedDiv.parentElement.id.indexOf(context) > -1){

                        domClass.remove(selectedDiv, "selected");
                        domStyle.set(selectedDiv.parentElement.id.match(/(.*)Nav/)[1], "display", "none");
                        domClass.remove(selectedDiv.parentElement.id.match(/(.*)Nav/)[1], "selected");
                    }
                });

                var state = ioQuery.queryToObject(hash());

                //if we're on the about page already, dont reset view
                if (state.v != "about") {
                    Hasher.setHash("v", "about");
                    Hasher.setHash("n", node['dataset'].src);

                } else {
                    Hasher.setHash("n", node['dataset'].src);
                }

                var replacementNode;
                switch (node['dataset'].src) {
                    case "GFW":
                        replacementNode = $("#aboutGFWNav");
                        break;
                    case "History":
                        replacementNode = $("#aboutHistoryNav");
                        break;
                    case "Partners":
                        replacementNode = $("#aboutPartnersNav");
                        break;
                    case "Videos":
                        replacementNode = $("#aboutVideosNav");
                        break;
                    case "Users":
                        replacementNode = $("#aboutUsersNav");
                        break;
                    default:
                        replacementNode = $("#aboutGFWNav");
                        break;
                }



                if (replacementNode[0]) {
                   // //if node matches #, set to selected
                    if (node['dataset'].src === replacementNode[0].id.replace("Nav", "").replace(context, "")){

                        domClass.add(replacementNode[0].children[0], "selected");
                        domStyle.set(replacementNode[0].id.match(/(.*)Nav/)[1], "display", "block");
                        domClass.add(replacementNode[0].id.match(/(.*)Nav/)[1], "selected");
                        // needsDefaults = false;
                        // activeNode = replacementNode[0].children[0];
                    }
                }


            },

        updateView: function(view, isExternal, initialized) {

            if (isExternal === "true") {
                this.redirectPage(view);
                return;
            }

            query(".header .nav-link.selected").forEach(function(node) {
                domClass.remove(node, 'selected');
            });

            query('.nav-link-list [data-view="' + view + '"]').forEach(function(node) {
                domClass.add(node, "selected");
            });

            if (initialized) {
                Hasher.setHash("v", view);
            }

        },

        toggleForView: function(view) {
            if (view === 'map') {
                this.setForMap();
            } else if (view === 'home') {
                this.setForHome();
            } else {
                this.setForGenericView();
            }
        },

        setForMap: function() {
            domClass.add("nav-content", "outer");
            domClass.remove("nav-content", "inner");
            domClass.add("app-header", "mapView");
            domClass.remove("app-header", "generalView");
        },

        setForGenericView: function() {
            this.setForHome();
            //domClass.add("nav-content", "outer");
            //domClass.remove("nav-content", "inner");
            domClass.remove("app-header", "mapView");
            domClass.add("app-header", "generalView");
            //domClass.remove("footerModesContainer", "generalView");
            $(".footerModesContainer").hide();

            // Resize the page here!

        },

        setForHome: function() {
            domClass.add("nav-content", "inner");
            domClass.remove("nav-content", "outer");
            domClass.remove("app-header", "mapView");
            domClass.remove("app-header", "generalView");
            $(".footerModesContainer").show();
        },

        redirectPage: function(view) {
            window.open(AppConfig.urls[view], "_blank");
        },

        addSubscriptionDialog: function() {
            this.dialog2 = new Dialog({
                style: 'width: 300px; text-align: center;'
            });
            var self = this;
            var content = '<p>To sign up for tree clearance or fire alerts go to the <span id="goToMapFromDialog">Map</span>, turn on a data layer from the Forest Use or Conservation drop-down tabs, select an area on the map, and click "Subscribe".</p>';

            this.dialog2.setContent(content);

            $("#goToMapFromDialog").css("color", "#e98300");
            $("#goToMapFromDialog").css("cursor", "pointer");
            $("#goToMapFromDialog").css("font-weight", "bold");

            $("#goToMapFromDialog").click(function(){
              self.dialog2.destroy();
              self.updateView("map", false, true);

            });

            $("#dijit_Dialog_0 > div.dijitDialogPaneContent").css("margin-top", "-30px");
            $("#dijit_Dialog_0 > div.dijitDialogPaneContent").css("margin-bottom", "-10px");

            this.dialog2.show();

        }


    };

});
