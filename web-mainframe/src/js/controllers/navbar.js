
app.controller('NavBarCtrl', ['$scope', 'NodeStore', function($scope, NodeStore) {

    initNavBarCtrl();

    function initNavBarCtrl(){
        $scope.navBarCallback = function(_state){
            $scope.state = _state;
            console.log($scope.state);
        };
        $scope.state = false;
        NodeStore.registerNavbarCallback($scope.navBarCallback);
    }
}]);

