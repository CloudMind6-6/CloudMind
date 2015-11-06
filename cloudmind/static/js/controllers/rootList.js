
app.controller('RootListCtrl', ['$modal', '$scope', '$state', 'NodeStore', 'UserStore', 'HttpSvc' ,
    function ($modal, $scope, $state, NodeStore, UserStore, HttpSvc) {

        initRootList();

        $scope.open = function() {
            $modal.open({
                templateUrl: 'tpl/modal_projectList.html',
                controller: 'modal-rootlist',
                scope: $scope
            });
        };

        $scope.selectRoot = function (_node, _idx, _user) {

            var userList;

            if(_idx) {
                userList = $scope.roots[_idx].user;
                _node = $scope.roots[_idx].node;
            }
            else userList = _user;

            UserStore.setUserList(userList, _node.node_idx);
            NodeStore.setNodeStore(_node.node_idx, _node, function () {
                $state.go('app.mindmap');
                NodeStore.setNavbarState(true);
            });
        };

        $scope.addRoot = function (_rootName) {

            if (!_rootName) return;
            NodeStore.addNode(_rootName, null, null, function(_node, _user){
                $scope.rootName = "";
                $scope.selectRoot(_node, false, _user);
            });
        };

        function initRootList() {

            NodeStore.setNavbarState(false);

            HttpSvc.getRoots()
                .success(function (res) {
                    if (res.success) {
                        $scope.roots = res.node_list;
                    }
                    else throw new Error;
                })
                .error(function (err) {
                    console.log(err);
                });
        }

    /* REST API TEST CODE */
/*
        $scope.updateNode = function(){

            //NodeStore.updateNode(1, 'ㅇㅁㄴ',null, 'Node updated!!!', function(){console.log('수정했당!');});
           // NodeStore.removeNode(1, function(){ console.log('지워졌당!');});
            //NodeStore.addLabelPalette(1,'palette',111111,function(){console.log('add palette')});
            //NodeStore.removeLabelPalette(1, function(res){console.log(res);})
            //NodeStore.updateLabelPalette(2,'ㅏㅣㅇㄴㅁㅁㄴ아ㅣ;','222222', function(res){console.log(res);})
           // NodeStore.addLabel(1,2,function(n,p){console.log(n+'    '+p)});
            //NodeStore.removeLabel(1,2,function(n,p){console.log(n+'    '+p)})

        }*/

    }]);

