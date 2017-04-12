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
    'utils/Helper',
    "main/config",
    'utils/Analytics'
], function(on, dom, domStyle, query, hash, domClass, ioQuery, Dialog, Hasher, Helper, AppConfig, Analytics) {
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

            if (isExternal === 'true') {
                Analytics.sendEvent('Event', 'Home Page Carousel Item Clicked', 'User clicked on INITIATIVE LAUNCHED.', 1);
                this.redirectPage(view);
                return;
            }

            if (view && view !== 'home') {
              var homePageCircle;

              switch (view) {
                case 'map-wizard':
                  homePageCircle = 'PALM OIL RISK TOOL';
                  break;
                case 'map-analysis':
                  homePageCircle = 'ANALYSIS';
                  break;
                case 'map-supplier':
                  homePageCircle = 'SUPPLIER MONITORING';
                  break;
                case 'map-palm':
                  homePageCircle = 'COMMODITIES';
                  break;
                case 'map':
                  homePageCircle = 'COMMODITIES MAP';
                  break;
                default:
              }
              // Emit Event for Analytics
              Analytics.sendEvent('Event', 'Home Page Carousel Item Clicked', 'User clicked on ' + homePageCircle + '.', 1);
            }

            if (view === 'map-wizard') {
              window.open(window.location.pathname + '#v=map&lyrs=tcc%2ChansenLoss%2Cmill%2CgfwMill&x=143.48&y=1.66&l=3&wiz=open', '_self');
              return;
            } else if (view === 'map-analysis') {
              window.open(window.location.pathname + '#v=map&lyrs=oilPerm%2CrspoPerm%2ClogPerm%2CminePerm%2CwoodPerm&x=143.48&y=1.66&l=3&wiz=open', '_self');
              return;
            } else if (view === 'map-supplier') {
              window.open(window.location.pathname + '#v=map&x=104.27&y=1.96&l=5&lyrs=tcc%2ChansenLoss%2Cmill%2CgfwMill&wiz=open', '_self');
              return;
            } else if (view === 'map-palm') {
              window.open(window.location.pathname + '#v=map&lyrs=rspoPerm&x=-150.13&y=-1.9&l=3', '_self');
              return;
            }

            query(".header .nav-link.selected").forEach(function(node) {
                domClass.remove(node, 'selected');
            });

            query('.nav-link-list [data-view="' + view + '"]').forEach(function(node) {
                domClass.add(node, "selected");
            });

            if (initialized) {
              Hasher.setHash('v', view);
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
            var content = '<p>To sign up for fire alerts go to the <span id="goToMapFromDialog">Map</span>, turn on a data layer from the Forest Use or Conservation drop-down tabs, select an area on the map, and click "Subscribe".</p>';

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
