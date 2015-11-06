app.controller('modal-rootlist',['$scope', '$modalInstance', function($scope, $modalInstance){
    $scope.cancel = function() {
        $modalInstance.close();
    }
    $scope.ok = function() {
        console.log($scope.nodename);
        $scope.addRoot($scope.nodename);

        $modalInstance.close({
            name: $scope.name,
            groupType: $scope.groupType
        });
    };
}]);