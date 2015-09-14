define([
    "dojo/dom",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/hash",
    "dojo/io-query",
    "utils/Hasher",
    "utils/Analytics"
], function (dom, query, domClass, domStyle, hash, ioQuery, Hasher, Analytics){

    // Utility Function
    // Convert DATA ANALYSIS to Data Analysis and ABOUT GFW to About GFW
    function convertToCamelCase (string) {
      return string.replace(/\w*/g, function(txt) {
        return txt === 'GFW' ? txt : txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    return {

        loadNavControl: function (context){
            query(".nav-item").forEach(function(node){

                if(node.id.indexOf(context) > -1){
                    //Add the a link function
                    node.onclick = function (){
                        changeNavItem (node, context);
                    };
                }
            });


            // query(".nav-link-more").forEach(function(node){
            //     node.onclick = function (){
            //         changeNavItemAbout(node, "about");
            //     };
            // });

            function changeNavItem (node, context) {
                query(".nav-item-a.selected ").forEach(function(selectedDiv){
                    if(selectedDiv.parentElement.id.indexOf(context) > -1){
                        domClass.remove(selectedDiv, "selected");
                        domStyle.set(selectedDiv.parentElement.id.match(/(.*)Nav/)[1], "display", "none");
                        domClass.remove(selectedDiv.parentElement.id.match(/(.*)Nav/)[1], "selected");
                    }
                });

                //Add 'selected' css class to nav list
                domClass.add(node.children[0], "selected");

                //Displays corresponding information div
                domStyle.set(node.id.match(/(.*)Nav/)[1], "display", "block");

                //clear old selected # in url

                //add new selected # in url
                //extract nav title
                var navTitle = node.id;
                navTitle = navTitle.replace("Nav", "").replace(context, "");

                Hasher.setHash("n", navTitle);

                // Camel Case the label and construct a clean url with minimal parameters
                var analyticsTitle = convertToCamelCase(context) + ' - ' + convertToCamelCase(node.children[0].innerHTML);
                var url = "/#v=" + context + "&n=" + navTitle;
                Analytics.sendPageview(url, analyticsTitle);
            }

            
        },

        loadNavView: function (context){

            
            var state = ioQuery.queryToObject(hash());
            var needsDefaults = true;
            var activeNode;

            if(state.hasOwnProperty("n")){
                //set selected nav-item
                query(".nav-item").forEach(function(node){
                    //check that its in appropriate context
                    if(node.id.indexOf(context) > -1){
                        //if node matches #, set to selected
                        if(state.n === node.id.replace("Nav", "").replace(context, "")){
                            domClass.add(node.children[0], "selected");
                            domStyle.set(node.id.match(/(.*)Nav/)[1], "display", "block");
                            domClass.add(node.id.match(/(.*)Nav/)[1], "selected");
                            needsDefaults = false;
                            activeNode = node.children[0];
                        }
                    }
                });
            } else {
            // if(needsDefaults){
                query(".nav-item-a.default-selection").forEach(function(node){
                    if(node.parentElement.id.indexOf(context) > -1){
                        domClass.add(node, "selected");
                        activeNode = node;
                    }
                });
                query(".nav-subpage.default-selection").forEach(function(node){
                    if(node.id.indexOf(context) > -1){
                        domStyle.set(node, "display", "block");
                    }
                });
            }
            if(state.hasOwnProperty("s")){
                if (dom.byId(state.s)) {
                    dom.byId(state.s).checked = true;
                }
            }

            // Camel Case the label and construct a clean url with minimal parameters
            var analyticsTitle = convertToCamelCase(context) + ' - ' + convertToCamelCase(activeNode.innerHTML);
            var subPage = activeNode.parentElement.id.replace("Nav", "").replace(context, "");
            var url = "/#v=" + context + "&n=" + subPage;
            Analytics.sendPageview(url, analyticsTitle);

        },

        urlControl: function (view) {
            //Page should be loaded, set URL
            //state object used to create url with dojo hasher
            var state = {};
            var divs;
            var i;

            state.v = view;

            //Grab selected nav items and add them to state oject
            var nodes = query(".nav-item-a.selected");
            if(nodes.length > 0){
                nodes.forEach(function(node){
                    if(node.parentElement.id.indexOf(view) > -1){
                        state.n = node.parentElement.id.replace("Nav", "").replace(view, "");
                    }
                });
            } else {
                if(state.n) {
                    delete state.n;
                }
            }

            //Grab subpage mapped from nav item and add to state object
            divs = document.getElementsByTagName('input');
            for(i=0; i < divs.length; i++) {
                if(divs[i].checked){
                    state.s = divs[i].id;
                } else {
                    if(state.s){
                        delete state.s;
                    }
                }
            }

            //Find checked divs in data page
            //Only in data page, check context (view)
            var dataClickablesNeedsCleared = true;
            divs = document.getElementsByTagName('input');
            for(i=0; i < divs.length; i++) {
                if(divs[i].checked){
                    state.s = divs[i].id;
                    dataClickablesNeedsCleared = false;
                }
            }

            var onDataPage = (view.indexOf("data") > -1);
            if(dataClickablesNeedsCleared || !onDataPage){
                if(state.s){
                    delete state.s;
                }
            }
            Hasher.setHashFromState(state);
        }


    };
});
