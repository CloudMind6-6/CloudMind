
app.service('NodeStore',  ['HttpSvc', function(HttpSvc){

    var navbarCallback = null;
    var url = 'img/a1.jpg';
    var nodeList = [];

    return {
        registerNavbarCallback : function(callback){
            navbarCallback = callback;
        },

        setNavbarState : function(_state) {

            if(navbarCallback) navbarCallback(_state)
        },

        setNodeList : function (_idx, callback) {

            this.setNavbarState(true);
            callback();

             HttpSvc.getNodes(_idx)
             .success(function (res){
                     if(res.success) {
                         nodeList = res.node_list;
                         rootSelected = true;
                         callback();
                     }
                     else throw new Error;
                 })
             .error(function (err){
                     console.log('err');
                     // 다이얼로그(에러모듈) 처리
                 });
        },

        syncNodeList : function () {
            return nodeList;
        },

        addNode : function(_nodename,_node_parent_idx, callback){
            if(callback) callback('idx');
            /*
            HttpSvc.addNode(_nodename,_node_parent_idx)
                .success(function (res){
                    if(res.success) {
                        if(_node_parent_idx){ // 해당 노드 idx 받아와야함
                            nodeList.push(res.node);
                        }
                        if(callback) callback(res.node.idx);
                    }
                    else throw new Error;
                })
                .error(function (err){
                    console.log('err');
                    // 다이얼로그(에러모듈) 처리
                });*/
        },


        removeNode : function(_idx, callback){
            removeNodeInList(_idx, callback);//루트를 지운거면 callback에서 따로 처리를 해줘야함
            /*
            HttpSvc.removeNode(_idx)
                .success(function (res){
                    if(res.success) {
                        removeNodeInList(_idx, callback);
                    }
                    else throw new Error;
                })
                .error(function (err){
                    console.log('err');
                    // 다이얼로그(에러모듈) 처리
                });*/
        },

        updateNode : function (_node_idx, _assignedUser, _dueDate, _nodename, callback){

            /*
            HttpSvc.updateNode(_node_idx, _assignedUser, _dueDate, _nodename)
                .success(function (res){
                    if(res.success) {

                        if(callback) callback();

                    }
                    else throw new Error;
                })
                .error(function (err){
                    console.log('err');
                    // 다이얼로그(에러모듈) 처리
                });
                */
        }
    };

    function removeNodeInList(_idx, callback){

        if(nodeList[0].rootidx == _idx) nodeList = {};

        for(var i in nodeList){
            if( nodeList[i].parentidx == _idx || nodeList[i].idx == _idx) {
                console.log(nodeList[i]);
                delete nodeList[i];
            }
        }

        if(callback) callback();
    }

    function updateNodeInList(_idx, _assignedUser, _dueDate, _nodename, callback){

        for(var i in nodeList){

            if(nodeList[i].idx == _idx) {
                console.log(nodeList[i]);
                nodeList[i].name = _nodename;
                nodeList[i].due_date = _dueDate;
                nodeList[i].assignedUsers = _assignedUser;
                //nodeList[i].description
            }
        }

        if(callback) callback();
    }
}]);

