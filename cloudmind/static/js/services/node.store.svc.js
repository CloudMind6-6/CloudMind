
/* FIX rest API error module */
/* nodelist callback :: function(nodelist) / palette callback :: function(false, palette) */

app.service('NodeStore',  ['HttpSvc', function(HttpSvc){

    var navbarCallback = null;
    var nodeStoreCallback = null;

    var nodeList = [];
    var labelPalette = [];

    return {

        registerNavbarCallback : function(callback){
            navbarCallback = callback;
        },

        setNavbarState : function(_state) {
            if(navbarCallback) navbarCallback(_state)
        },

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
            removeNodeInList(_idx);//루트를 지운거면 callback에서 따로 처리를 해줘야함

            HttpSvc.removeNode(_idx)
                .success(function (res){
                    if(res.success) {
                        removeNodeInList(_idx);
                    }
                    else throw new Error;
                })
                .error(function (err){
                    console.log('err');
                    // 다이얼로그(에러모듈) 처리
                });
        },

        updateNode : function (_idx, _node_name, _dueDate, _description){

            HttpSvc.updateNode(_idx, _node_name, _dueDate, _description)
                .success(function (res) {
                    console.log(res);
                    if (res.success) {
                        updateNodeInList(_idx, _node_name, _dueDate, _description)
                    }
                    else throw new Error;
                })
                .error(function (err) {
                    console.log(err);
                }
            );
        },

        addLabelPalette : function(_root_idx, _name, _color){

            HttpSvc.addLabelpalette(_root_idx, _name, _color)
                .success(function (res) {


                })
                .error(function(err){
                    console.log(err);
                });
        },

        removeLabelPalette : function(){ /*라벨 팔레트 또한 지울때 모든 라벨을 삭제해줘야함*/

        },

        updateLabelPalette : function(){

        }
    };

    function removeNodeInList(_idx){

        if(nodeList[0].rootidx == _idx) nodeList = {};

        for(var i in nodeList){
            if( nodeList[i].parentidx == _idx || nodeList[i].idx == _idx) {
                console.log(nodeList[i]);
                delete nodeList[i];
            }
        }
        nodeStoreCallback();
    }

    function updateNodeInList(_idx, _nodename, _dueDate, _description){

        for(var i in nodeList){
            if(nodeList[i].idx == _idx) {
                console.log(nodeList[i]);
                nodeList[i].name = _nodename;
                nodeList[i].due_date = _dueDate;
                nodeList[i].description = _description
            }
        }

        nodeStoreCallback();
    }


}]);

