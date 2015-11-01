
app.service('NodeStore',  ['HttpSvc', function(HttpSvc){
    var url = 'img/a1.jpg';
    var nodeList =
        [{
        idx: '22',
        name: 'ROOT NODE2',
        due_date: '2015-12-12',
        parentidx: '11',
        rootidx:'0',
        description : 'des',
        assignedUsers :[{
            idx : '1',
            pic : url
        },
            {
                idx : '1',
                pic : url
            },
            {
                pic : url
            }]

    },
        {
            idx : '22',
            name : 'ROOT NODE3',
            due_date : '2015-12-12',
            parentidx: '11',
            rootidx:'0',
            description : 'des',
            assignedUsers :[{
                idx : '1',
                pic : url
            },
                {
                    idx : '1',
                    pic : url
                },
                {
                    pic : url
                }]
        },
        {
            idx : '22',
            name : 'ROOT NODE',
            due_date : '2015-12-12',
            parentidx: '11',
            rootidx:'0',
            description : 'des',
            assignedUsers :[{
                idx : '1',
                pic : url
            },
                {
                    idx : '1',
                    pic : url
                },
                {
                    pic : url
                }]
        },
        {
            idx : '33',
            name : 'ROOT NODE',
            due_date : '2015-12-12',
            parentidx: '22',
            rootidx:'0',
            description : 'des',
            assignedUsers :[{
                idx : '1',
                pic : url
            },
                {
                    idx : '1',
                    pic : url
                },
                {
                    pic : url
                }]
        }];

    return {
        setNodeList : function (_idx, callback) {

            callback();

            /*
             HttpSvc.getNodes(_idx)
             .success(function (res){
                     if(res.success) {
                         nodeList = res.node_list;
                         callback();
                     }
                     else throw new Error;
                 })
             .error(function (err){
                     console.log('err');
                     // 다이얼로그(에러모듈) 처리
                 });*/
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

        var newNode = {
            node_idx: _idx,
            AssignedUser: _assignedUser,
            DueDate: _dueDate,
            Nodename: _nodename
        };

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

