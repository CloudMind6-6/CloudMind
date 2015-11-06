
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

        $scope.selectRoot = function (_nodeidx, _idx, _user) {

            var userList;

            if(_idx) userList = $scope.roots[_idx].user;
            else userList = _user;

            console.log(userList);

            UserStore.setUserList(userList, _nodeidx);
            NodeStore.setNodeStore(_nodeidx, function () {
                console.log(_nodeidx);
                $state.go('app.mindmap');
                NodeStore.setNavbarState(true);
            });
        };

        $scope.addRoot = function () {

            if (!$scope.rootName) return;
            NodeStore.addNode($scope.rootName, null);
        };

        function initRootList() {

            $scope.addRootCallback = function (_node, _user) {
                $state.go('app.mindmap');
                $scope.rootName = "";
                $scope.selectRoot(_node.node_idx, false, _user);
            };

            NodeStore.setNavbarState(false);
            NodeStore.registerNodeStoreCallback($scope.addRootCallback);

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

        $scope.updateNode = function(){
            NodeStore.updateNode(10, 'updatedNOde',null, 'Node updated!!!');
            //NodeStore.removeNode(1);
        }

    }]);

