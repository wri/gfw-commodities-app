define([
    "dojo/dom",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/hash",
    "dojo/io-query",
    "utils/Hasher"
], function (dom, query, domClass, domStyle, hash, ioQuery, Hasher){

    return {

        loadNavControl: function (context){
            query(".nav-item").forEach(function(node){

                if(node.id.indexOf(context) > -1){
                    //Add the a link function
                    node.onclick = function (){
                        changeNavItem (node, context);
                    }
                }
            });

            function changeNavItem (node, context) {
                query(".nav-item-a.selected ").forEach(function(selectedDiv){
                    if(selectedDiv.parentElement.id.indexOf(context) > -1){
                        domClass.remove(selectedDiv, "selected");
                        domStyle.set(selectedDiv.parentElement.id.match(/(.*)Nav/)[1], "display", "none");
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

            };
        },

        loadNavView: function (context){
            var state = ioQuery.queryToObject(hash());
            var needsDefaults = true;
            if(state.hasOwnProperty("n")){
                //set selected nav-item
                query(".nav-item").forEach(function(node){
                    //check that its in appropriate context
                    if(node.id.indexOf(context) > -1){
                        //if node matches #, set to selected
                        if(state.n === node.id.replace("Nav", "").replace(context, "")){
                            domClass.add(node.children[0], "selected");
                            domStyle.set(node.id.match(/(.*)Nav/)[1], "display", "block");
                            needsDefaults = false;
                        }
                    }
                });
            }
            if(needsDefaults){
                query(".nav-item-a.default-selection").forEach(function(node){
                    if(node.parentElement.id.indexOf(context) > -1){
                        domClass.add(node, "selected");
                    }
                })
                query(".nav-subpage.default-selection").forEach(function(node){
                    if(node.id.indexOf(context) > -1){
                        domStyle.set(node, "display", "block");
                    }
                })
            }
            if(state.hasOwnProperty("s")){
                dom.byId(state.s).checked = true;
            }
        }
    };
})
