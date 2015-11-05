app.controller('modal-rootlist',['$scope', '$modalInstance', 'NodeStore', function($scope, $modalInstance, NodeStore){
    $scope.cancel = function() {
        $modalInstance.close();
    }
    $scope.ok = function() {
        console.log($scope.nodename);
        NodeStore.addNode($scope.nodename, null, function (_idx) {
            $scope.selectRoot(_idx);
        })

        $modalInstance.close({
            name: $scope.name,
            groupType: $scope.groupType
        });
    };
}]);