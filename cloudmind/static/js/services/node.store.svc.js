
/* FIX rest API error module */

app.service('NodeStore',  ['HttpSvc', function(HttpSvc){

    var navbarCallback = null;

    var nodeList = [];
    var labelPalette;

    return {

        /* NavBar */
        registerNavbarCallback : function(callback){
            navbarCallback = callback;
        },

        setNavbarState : function(_state) {
            if(navbarCallback) navbarCallback(_state)
        },

        /* Node INIT*/

        setNodeStore : function(_idx,  callback){

            var isSet = {setNodeList : false, setPalette : false};

            this.setNodeList(_idx, null, function(_value){
                isSet[_value] = true;
                if(isSet.setNodeList && isSet.setPalette) callback();
            });

            this.setLabelPalette(_idx,  function(_value){
                isSet[_value] = true;
                if(isSet.setNodeList && isSet.setPalette) callback();
            });
        },

        setNodeList : function (_idx, _null, callback) {
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
                        var palette_list = res.label_palette_list;

                        labelPalette = new Object();
                        for(var i in palette_list){
                            var idx = palette_list[i].palette_idx;
                            labelPalette[idx] = palette_list[i];
                            if(i==5) labelPalette[idx].color = '#00'+labelPalette[idx].color.toString(16).toUpperCase();
                            else labelPalette[idx].color = '#'+labelPalette[idx].color.toString(16).toUpperCase();
                        }
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
                        console.log(res.node);
                        nodeList = res.node_list;
                        if(_node_parent_idx) callback(res.node, res.node_list);
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
                        nodeList = res.node_list;
                        callback(_idx, res.node_list);
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
                        nodeList = res.node_list;
                        callback(res.node, res.node_list);
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
                        callback(res.palette);
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
                    nodeList = res.node_list;

                    if(res.success) callback(res.node_list, res.palette_list);
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
                        nodeList = res.node_list;
                        callback(_node_id, res.node_list, _palette_id);
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
                        nodeList = res.node_list;
                        callback(_node_id, res.node_list, _palette_id);
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

        }
    };



}]);

