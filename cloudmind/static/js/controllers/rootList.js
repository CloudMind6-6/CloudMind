app.controller('RootListCtrl', ['$modal','$scope', '$state', 'NodeStore', 'UserStore',
    function ($modal, $scope, $state, NodeStore, UserStore) {

        var url = 'img/a1.jpg';

        $scope.roots = [
            {node : {nodeidx : '11', name : 'ROOT NODE1', due_date : '2015-12-12'},
                user : [{account_id : '1',name : 'cho', email : "cloud@test.com", profile_url : url},
                    {account_id : '2',name : 'rong', email : "cloud@test.com", profile_url : url}]},
            {node : {nodeidx : '11', name : 'ROOT NODE2', due_date : '2015-12-12'},
                user : [{account_id : '1',name : 'cho', email : "cloud@test.com", profile_url : url},
                    {account_id : '2',name : 'rong', email : "cloud@test.com", profile_url : url},
                    {account_id : '3',name : 'rong', email : "cloud@test.com", profile_url : url}]},
            {node : {nodeidx : '11', name : 'ROOT NODE3', due_date : '2015-12-12'},
                user : [{account_id : '1',name : 'cho', email : "cloud@test.com", profile_url : url}]},
            {node : {nodeidx : '11', name : 'ROOT NODE4', due_date : '2015-12-12'},
                user : [{account_id : '1',name : 'cho', email : "cloud@test.com", profile_url : url},
                    {account_id : '2',name : 'rong', email : "cloud@test.com", profile_url : url},
                    {account_id : '3',name : 'rong', email : "cloud@test.com", profile_url : url}]},
            {node : {nodeidx : '11', name : 'ROOT NODE5', due_date : '2015-12-12'},
                user : [{account_id : '1',name : 'cho', email : "cloud@test.com", profile_url : url},
                    {account_id : '2',name : 'rong', email : "cloud@test.com", profile_url : url},
                    {account_id : '3',name : 'rong', email : "cloud@test.com", profile_url : url}]},
            {node : {nodeidx : '11', name : 'ROOT NODE6', due_date : '2015-12-12'},
                user : [{account_id : '1',name : 'cho', email : "cloud@test.com", profile_url : url},
                    {account_id : '2',name : 'rong', email : "cloud@test.com", profile_url : url}]}];

        initRootList();

        $scope.open = function() {
            $modal.open({
                templateUrl: 'tpl/modal_projectList.html',
                controller: 'modal-rootlist',
                scope: $scope
            });
        };

        $scope.selectRoot = function (_nodeidx, _idx) {
            $state.go('app.mindmap');
            UserStore.setSelectedIdx(_idx, _nodeidx);
            NodeStore.setNodeStore(_nodeidx, function () {
                $state.go('app.mindmap');
            });
        };

        $scope.addRoot = function () {

            if (!$scope.rootName) return;

            NodeStore.addNode($scope.rootName, null, function (_idx) {
                $scope.rootName = "";
                $scope.selectRoot(_idx);
            })

        };

        function initRootList() {

            NodeStore.setNavbarState(false);
            setUserStore();

            /*
             HttpSvc.getRoots()
             .success(function (res){
             if(res.success) {
             $scope.roots=res.node_list;
             setUserStore();
             }
             else throw new Error;
             })
             .error(function (err){
             console.log('err');
             // 다이얼로그(에러모듈) 처리
             });*/
        }

        function setUserStore(){
            var userList = new Array;

            for(var root in $scope.roots){
                userList.push($scope.roots[root].user);
            }
            UserStore.setUserList(userList);
        }
    }]);

