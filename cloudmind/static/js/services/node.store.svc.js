
/* FIX rest API error module */
/* nodelist callback :: function(nodelist) / palette callback :: function(false, palette) */

app.service('NodeStore',  ['HttpSvc', function(HttpSvc){

    var navbarCallback = null;
    var nodeStoreCallback = null;

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
        registerNodeStoreCallback : function(callback){
            nodeStoreCallback = callback;
        },

        setNodeStore : function(_idx, callback){

            var isSet = {setNodeList : false, setPalette : false};

            this.setNodeList(_idx, function(_value){
                isSet[_value] = true;
                if(isSet.setNodeList && isSet.setPalette) callback();
            });

            this.setLabelPalette(_idx, function(_value){
                isSet[_value] = true;
                if(isSet.setNodeList && isSet.setPalette) callback();
            });
        },

        setNodeList : function (_idx, callback) {
             HttpSvc.getNodes(_idx)
             .success(function (res){
                     if(res.success) {
                         nodeList = res.node_list;
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
                        nodeList = res.node_list;
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
        addNode : function(_node_name,_node_parent_idx, _node_root_idx){

            HttpSvc.addNode(_node_name,_node_parent_idx, _node_root_idx)
                .success(function (res){
                    console.log(res);
                    if(res.success) {
                        if(_node_parent_idx){
                            nodeList.push(res.node);
                            nodeStoreCallback(nodeList);
                        }
                        else nodeStoreCallback(res.node, res.user);
                    }
                    else throw new Error;
                })
                .error(function (err){
                    console.log(err);
                });
        },

        removeNode : function(_idx){
           // removeNodeInList(_idx);//루트를 지운거면 callback에서 따로 처리를 해줘야함

            HttpSvc.removeNode(_idx)
                .success(function (res){
                    if(res.success) {
                        console.log(res);
                        removeNodeToList(_idx);
                    }
                    else throw new Error;
                })
                .error(function (err){
                    console.log(err);
                    // 다이얼로그(에러모듈) 처리
                });
        },

        updateNode : function (_idx, _node_name, _dueDate, _description){

            HttpSvc.updateNode(_idx, _node_name, _dueDate, _description)
                .success(function (res) {
                    console.log(res);
                    if (res.success) {
                        updateNodeToList(_idx, _node_name, _dueDate, _description)
                    }
                    else throw new Error;
                })
                .error(function (err) {
                    console.log(err);
                }
            );
        },

        /* Palette */
        addLabelPalette : function(_root_idx, _name, _color){

            HttpSvc.addLabelpalette(_root_idx, _name, _color)
                .success(function (res) {
                    if(res){
                        labelPalette.push(res.label_palette);
                        nodeStoreCallback(false, labelPalette);
                    }
                    else throw new Error;
                })
                .error(function(err){
                    console.log(err);
                });
        },

        removeLabelPalette : function(_palette_id){ /* 라벨 팔레트 또한 지울때 모든 라벨을 삭제해줘야함 */
            HttpSvc.removeLabelpalette(_palette_id)
                .success(function (res) {
                    if(res) removePaletteToList(_palette_id);
                    else throw new Error;
                })
                .error(function(err){
                    console.log(err);
                });
        },

        updateLabelPalette : function(_palette_id, _name, _color){
            HttpSvc.updateLabelpalette(_palette_id, _name, _color)
                .success(function (res) {
                    if(res) updatePaletteToList(_palette_id);
                    else throw new Error;
                })
                .error(function(err){
                    console.log(err);
                });
        },

        /* Label */

        addLabel : function(_node_id, _palette_id){
            HttpSvc.addLabel(_node_id, _palette_id)
                .success(function(res){
                    if(res) addLabelToNode(_node_id,_palette_id);
                    else throw new Error;
                })
                .error(function(err){
                    console.log(err);
                });
        },

        removeLabel : function(_node_id, _palette_id){
            HttpSvc.removeLabel(_node_id, _palette_id)
                .success(function(res){
                    if(res) removeLabelToNode(_node_id,_palette_id);
                    else throw new Error;
                })
                .error(function(err){
                    console.log(err);
                });
        }
    };

    function removeNodeToList(_idx){

        /*
        if(nodeList[0].rootidx == _idx) nodeList = {};

        for(var i in nodeList){
            if( nodeList[i].parentidx == _idx || nodeList[i].idx == _idx) {
                console.log(nodeList[i]);
                delete nodeList[i];
            }
        }*/
        nodeStoreCallback(nodeList);
    }

    function updateNodeToList(_idx, _node_name, _dueDate, _description){

        for(var i in nodeList){
            if(nodeList[i].idx == _idx) {
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
            if(labelPalette[i].idx == _idx) {
                console.log(nodeList[i]);
                labelPalette[i].name = _name;
                labelPalette[i].color = _color;
            }
        }
        nodeStoreCallback(false, nodeList);
    }

    function removePaletteToList(_idx){
        for(var i in labelPalette){
            if(labelPalette[i].idx == _idx) labelPalette.slice(i , 1 );
        }
        nodeStoreCallback(false, nodeList);
    }

    function addLabelToNode(_node_id,_palette_id){

        for(var i in nodeList){
            if(nodeList[i].idx == _node_id)
                nodeList[i].label.push(_palette_id);
        }

        nodeStoreCallback(nodeList);
    }

    function removeLabelToNode(_node_id,_palette_id){
        for(var i in nodeList){
            if(nodeList[i].idx == _node_id) {
                var idx = nodeList[i].label.indexOf(_palette_id);
                nodeList[i].label.slice(idx,1);
            }
        }
        nodeStoreCallback(nodeList);
    }
}]);

