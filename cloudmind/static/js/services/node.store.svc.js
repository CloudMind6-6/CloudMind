
app.service('NodeStore',  ['HttpSvc', function(HttpSvc){

    var navbarCallback = null;
    var nodeStoreCallbacks = [];
    var url = 'img/a1.jpg';

    var nodeList = [
        {idx:1, parent_idx:1, root_idx:1, name:"node1", desc:"asdfasdfasdf", assigned_user:[1001, 1002, 1003], labels:[0,1], due_date:"2015-11-19"},
        {idx:2, parent_idx:1, root_idx:1, name:"node2", desc:"zxcv", assigned_user:[1001, 1002, 1003], labels:[1,2], due_date:"2015-11-19"},
        {idx:3, parent_idx:2, root_idx:1, name:"node3", desc:"afawefeff", assigned_user:[1001, 1002, 1003], labels:[0,2], due_date:"2015-11-19"},
        {idx:4, parent_idx:1, root_idx:1, name:"node4", desc:"AWEFAWVSZDF", assigned_user:[1001, 1002, 1003], labels:[5,6], due_date:"2015-11-19"},
        {idx:5, parent_idx:4, root_idx:1, name:"node5", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
        {idx:6, parent_idx:1, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
        {idx:7, parent_idx:1, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
        {idx:8, parent_idx:1, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

        {idx:11, parent_idx:4, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
        {idx:12, parent_idx:4, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
        {idx:13, parent_idx:4, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

        {idx:14, parent_idx:7, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
        {idx:15, parent_idx:7, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
        {idx:16, parent_idx:7, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

        {idx:17, parent_idx:16, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

        {idx:20, parent_idx:6, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
        {idx:21, parent_idx:6, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
        {idx:22, parent_idx:6, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

        {idx:24, parent_idx:8, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},

        {idx:30, parent_idx:24, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
        {idx:31, parent_idx:24, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
        {idx:32, parent_idx:24, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
        {idx:33, parent_idx:24, root_idx:1, name:"node6", desc:"FAWEFAWEFAWG", assigned_user:[1001, 1002, 1003], labels:[0,7], due_date:"2015-11-19"},
    ];
    var labelPalette = [];

    return {
        registerNavbarCallback : function(callback){
            navbarCallback = callback;
        },

        setNavbarState : function(_state) {
            if(navbarCallback) navbarCallback(_state)
        },

        registerNodeStoreCallback : function(callback){
            nodeStoreCallbacks.push(callback)
        },

        setNodeStore : function(_idx, callback){

            var isSet = {setNodeList : false, setPalette : false};

            this.setNodeList(_idx, function(_value){
                isSet[_value] = true;
                this.setNavbarState(true);
                if(isSet.setNodeList && isSet.setPalette) callback();
            });

            this.setLabelPalette(_idx, function(_value){
                isSet[_value] = true;
                this.setNavbarState(true);
                if(isSet.setNodeList && isSet.setPalette) callback();
            });
        },

        setNodeList : function (_idx, callback) {

            this.setNavbarState(true);

            /*
             HttpSvc.getNodes(_idx)
             .success(function (res){
                     if(res.success) {
                         nodeList = res.node_list;
                         rootSelected = true;
                     }
                     else throw new Error;
                 })
             .error(function (err){
                     console.log('err');
                     // 다이얼로그(에러모듈) 처리
                 });*/
        },

        setLabelPalette : function(_idx, callback){
            HttpSvc.getLabelpalettes(_idx)
                .success(function (res){
                    if(res.success) {
                        nodeList = res.node_list;
                        rootSelected = true;
                        this.setNavbarState(true);
                    }
                    else throw new Error;
                })
                .error(function (err){
                    console.log('err');
                    // 다이얼로그(에러모듈) 처리
                });
        },

        getNodeList : function () {
            return nodeList;
        },

        getLabelPalette : function(){
            return labelPalette;
        },

        addNode : function(_nodename,_node_parent_idx){
            HttpSvc.addNode(_nodename,_node_parent_idx)
                .success(function (res){
                    console.log(res);
                    if(res.success) {
                        if(_node_parent_idx){ // 해당 노드 idx 받아와야함
                            nodeList.push(res.node);
                            notifyNodeStoreChange();
                        }
                    }
                    else throw new Error;
                })
                .error(function (err){
                    console.log('err');
                    // 다이얼로그(에러모듈) 처리
                });
        },


        removeNode : function(_idx){
            removeNodeInList(_idx);//루트를 지운거면 callback에서 따로 처리를 해줘야함
            /*
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
                });*/
        },

        updateNode : function (_node_idx, _assignedUser, _dueDate, _nodename){

            /*
            HttpSvc.updateNode(_node_idx, _assignedUser, _dueDate, _nodename)
                .success(function (res){
                    if(res.success) {
                        updateNodeInList(_idx, _assignedUser, _dueDate, _nodename)
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

    function removeNodeInList(_idx){

        if(nodeList[0].rootidx == _idx) nodeList = {};

        for(var i in nodeList){
            if( nodeList[i].parentidx == _idx || nodeList[i].idx == _idx) {
                console.log(nodeList[i]);
                delete nodeList[i];
            }
        }
        notifyNodeStoreChange();
    }

    function updateNodeInList(_idx, _assignedUser, _dueDate, _nodename){

        for(var i in nodeList){

            if(nodeList[i].idx == _idx) {
                console.log(nodeList[i]);
                nodeList[i].name = _nodename;
                nodeList[i].due_date = _dueDate;
                nodeList[i].assignedUsers = _assignedUser;
                //nodeList[i].description
            }
        }

        notifyNodeStoreChange();
    }

    function notifyNodeStoreChange(){
        angular.forEach(nodeStoreCallbacks, function(callback){
            callback();
        });
    }

    function removeNodeStoreCallback(){
        // 페이지 이동시시 해당콜백 지워주는 함수
    }

}]);

