define([
    "dojo/dom",
    "dojo/query",
    "dojo/dom-class",
    "dojo/dom-style",
    "utils/Hasher"
], function (dom, query, domClass, domStyle, Hasher){

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
                query(".nav-subpage.selected ").forEach(function(selectedDiv){
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
        }
    };

})