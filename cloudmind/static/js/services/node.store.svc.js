
/* FIX rest API error module */

app.service('NodeStore',  ['HttpSvc', function(HttpSvc){

    var navbarCallback = null;

    var nodeList = [];
    var labelPalette = [];

    return {

        /* NavBar */
        registerNavbarCallback : function(callback){
            navbarCallback = callback;
        },

        setNavbarState : function(_state) {
            if(navbarCallback) navbarCallback(_state)
        },

        /* Node INIT*/

        setNodeStore : function(_idx, _node, callback){

            var isSet = {setNodeList : false, setPalette : false};

            this.setNodeList(_idx, _node, function(_value){
                isSet[_value] = true;
                if(isSet.setNodeList && isSet.setPalette) callback();
            });

            this.setLabelPalette(_idx, function(_value){
                isSet[_value] = true;
                if(isSet.setNodeList && isSet.setPalette) callback();
            });
        },

        setNodeList : function (_idx,_node, callback) {
             HttpSvc.getNodes(_idx)
             .success(function (res){
                     if(res.success) {
                         nodeList = res.node_list;
                         //nodeList.unshift(_node);
                         callback('setNodeList');
                     }
                     else throw new Error;
                 })
             .error(function (err){
                     console.log(err);
                 });
        },

        setLabelPalette : function(_idx, callback){
            HttpSvc.getLabelpalettes(_idx)
                .success(function (res){
                    if(res.success) {
                        labelPalette = res.label_palette_list;
                        callback('setPalette');
                    }
                    else throw new Error;
                })
                .error(function (err){
                    console.log(err);
                });
        },

        getNodeList : function () {
            return nodeList;
        },

        getLabelPalette : function(){
            return labelPalette;
        },

        /* Node */
        addNode : function(_node_name,_node_parent_idx, _node_root_idx, callback){

            HttpSvc.addNode(_node_name,_node_parent_idx, _node_root_idx)
                .success(function (res){
                    if(res.success) {
                        if(_node_parent_idx) callback(res.node);
                        else callback(res.node, res.user);
                    }
                    else throw new Error;
                })
                .error(function (err){
                    console.log(err);
                });
        },

        removeNode : function(_idx, callback){

            HttpSvc.removeNode(_idx)
                .success(function (res){
                    if(res.success) {
                        callback(_idx);
                    }
                    else throw new Error;
                })
                .error(function (err){
                    console.log(err);
                });
        },

        updateNode : function (_idx, _node_name, _dueDate, _description, callback){

            HttpSvc.updateNode(_idx, _node_name, _dueDate, _description)
                .success(function (res) {
                    if (res.success) {
                        callback(res.node);
                    }
                    else throw new Error;
                })
                .error(function (err) {
                    console.log(err);
                    callback(false);
                }
            );
        },

        /* Palette */
        addLabelPalette : function(_root_idx, _name, _color, callback){

            HttpSvc.addLabelpalette(_root_idx, _name, _color)
                .success(function (res) {
                    if(res.success){
                        callback(res.label_palette );
                    }
                    else throw new Error;
                })
                .error(function(err){
                    console.log(err);
                });
        },

        removeLabelPalette : function(_palette_id, callback){ /* 라벨 팔레트 또한 지울때 모든 라벨을 삭제해줘야함 */
            HttpSvc.removeLabelpalette(_palette_id)
                .success(function (res) {
                    if(res.success) callback(_palette_id);
                    else throw new Error;
                })
                .error(function(err){
                    console.log(err);
                });
        },

        updateLabelPalette : function(_palette_id, _name, _color, callback){
            HttpSvc.updateLabelpalette(_palette_id, _name, _color)
                .success(function (res) {
                    if(res.success){
                        callback(res.palette);
                    }
                    else throw new Error;
                })
                .error(function(err){
                    console.log(err);
                });
        },

        /* Label */

        addLabel : function(_node_id, _palette_id, callback){
            HttpSvc.addLabel(_node_id, _palette_id)
                .success(function(res){
                    if(res.success) {
                        callback(_node_id,_palette_id);
                    }
                    else throw new Error;
                })
                .error(function(err){
                    console.log(err);
                });
        },

        removeLabel : function(_node_id, _palette_id, callback){
            HttpSvc.removeLabel(_node_id, _palette_id)
                .success(function(res){
                    if(res.success) {
                        callback(_node_id,_palette_id);
                    }
                    else throw new Error;
                })
                .error(function(err){
                    console.log(err);
                });
        },

        addLeaf : function(){

        },

        removeLeaf : function(){

        },


    };

    /* Node List 수정 함수 /
    /*

    function removeNodeToList(_idx, callback){


        if(nodeList[0].root_idx == _idx) nodeList = {};

        for(var i in nodeList){
            if( nodeList[i].parent_idx == _idx || nodeList[i].node_idx == _idx) {
                console.log(nodeList[i]);
                delete nodeList[i];
            }
        }
        callback();
    }

    function updateNodeToList(_idx, _node_name, _dueDate, _description){

        for(var i in nodeList){
            if(nodeList[i].node_idx == _idx) {
                console.log(nodeList[i]);
                nodeList[i].name = _node_name;
                nodeList[i].due_date = _dueDate;
                nodeList[i].description = _description
            }
        }

        nodeStoreCallback(nodeList);
    }

    function updatePaletteToList(_idx, _name, _color){
        for(var i in labelPalette){
            if(labelPalette[i].node_idx == _idx) {
                console.log(nodeList[i]);
                labelPalette[i].name = _name;
                labelPalette[i].color = _color;
            }
        }
        nodeStoreCallback(false, nodeList);
    }

    function removePaletteToList(_idx){
        for(var i in labelPalette){
            if(labelPalette[i].node_idx == _idx) labelPalette.slice(i , 1 );
        }
        nodeStoreCallback(false, nodeList);
    }

    function addLabelToNode(_node_id,_palette_id){

        for(var i in nodeList){
            if(nodeList[i].node_idx == _node_id)
                nodeList[i].label.push(_palette_id);
        }

        nodeStoreCallback(nodeList);
    }

    function removeLabelToNode(_node_id,_palette_id, callback){
        for(var i in nodeList){
            if(nodeList[i].node_idx == _node_id) {
                var idx = nodeList[i].label.indexOf(_palette_id);
                nodeList[i].label.slice(idx,1);
            }
        }
        callback(nodeList);
    }*/
}]);

