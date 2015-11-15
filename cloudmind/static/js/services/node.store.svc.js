
/* FIX rest API error module */

app.service('NodeStore',  ['HttpSvc', function(HttpSvc){

    var navbarCallback = null;

    var rootList = null;

    var nodeList = [];
    var leafList = [];
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

            var isSet = {
                nodeList : false,
                palette  : false,
                leafList : false
            };

            rootList = null;

            this.setNodeList(_idx, null, function(_value){
                isSet[_value] = true;
                if(isSet.nodeList && isSet.palette && isSet.leafList) callback();
            });

            this.setLabelPalette(_idx, function(_value){
                isSet[_value] = true;
                if(isSet.nodeList && isSet.palette && isSet.leafList) callback();
            });

            this.setLeafList(_idx, function(_value){
                isSet[_value] = true;
                console.log(leafList);
                if(isSet.nodeList && isSet.palette && isSet.leafList) callback();
            })
        },

        setNodeList : function (_idx, _null, callback) {
            HttpSvc.getNodes(_idx)
                .success(function (res) {
                    if (res.success) {
                        nodeList = res.node_list;
                        callback('nodeList');
                    }
                    else throw new Error;
                })
                .error(function (err) {
                    console.log(err);
                }
            );
        },

        setLeafList: function (_idx, callback) {
            HttpSvc.getLeafs(_idx)
                .success(function (res) {
                    if (res.success) {
                        leafList = res.leaf_list;
                        callback('leafList');
                    }
                    else throw new Error;
                })
                .error(function (err) {
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

                            var temp;
                            var idx = palette_list[i].palette_idx;
                            labelPalette[idx] = palette_list[i];

                            if(labelPalette[idx].color[0] == '#') temp = labelPalette[idx].color;
                            else if(i==5) temp = '#00'+labelPalette[idx].color.toString(16).toUpperCase();
                            else temp = '#'+labelPalette[idx].color.toString(16).toUpperCase();

                            labelPalette[idx].color = temp;
                        }
                        callback('palette');

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

        getNode : function(_idx)
        {
            for(var i = 0; i < nodeList.length; ++i)
            {
                var node = nodeList[i];

                if(_idx == node.node_idx)
                    return node;
            }

            return null;
        },

        getLeafList : function(){
            return leafList;
        },

        getLeaf : function(_idx)
        {
            for(var i = 0; i < leafList.length; ++i)
            {
                var leaf = leafList[i];

                if(_idx == leaf.id)
                    return leaf;
            }

            return null;
        },


        getLabelPalette : function(){
            return labelPalette;
        },

        setRootList : function(callback){
            HttpSvc.getRoots()
                .success(function (res) {
                    if (res.success) {
                        rootList = res.node_list;
                        callback();
                    }
                    else throw new Error;
                })
                .error(function (err) {
                    console.log(err);
                }
            );
        },

        getRootList : function(){
            return rootList;
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

        updateNode : function (_idx, _parent_idx, _node_name, _dueDate, _description, assigned_users, callback){

            HttpSvc.updateNode(_idx, _parent_idx, _node_name, _dueDate, _description, assigned_users)
                .success(function (res) {
                    if (res.success) {
                        nodeList = res.node_list;
                        callback(_idx, res.node_list);
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

        addLeaf : function(file, _node_idx, callback){
            HttpSvc.uploadLeaf(file, _node_idx, callback)
                .success(function(res){
                    if(res.success) {
                        callback(_node_idx, res.leaf, res.node_list);
                    }
                    else throw new Error;
                })
            .error(function(err){
                console.log(err);
            });
        },

        removeLeaf: function (_leaf_idx, callback) {

            HttpSvc.removeLeaf(_leaf_idx, callback)
                .success(function(res){
                    if(res.success) {
                        callback(_leaf_idx, res.leaf_list);
                    }
                    else throw new Error;
                })
                .error(function(err){
                    console.log(err);
                });
        },

        updateLeaf: function (_leaf_idx, _node_parent_idx, callback) {
            HttpSvc.updateLeaf(_leaf_idx, _node_parent_idx)
                .success(function(res){
                    if(res.success) {
                        callback(res.leaf, res.leaf_list);
                    }
                    else throw new Error;
                })
                .error(function(err){
                    console.log(err);
                });
        }
        
    };
}]);

