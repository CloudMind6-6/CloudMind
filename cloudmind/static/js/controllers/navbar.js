
app.controller('NavBarCtrl', ['$scope', 'NodeStore', function($scope, NodeStore) {

    initNavBarCtrl();

    function initNavBarCtrl(){
        $scope.navBarCallback = function(_state){
            $scope.state = _state;
        };
        $scope.state = false;
        NodeStore.registerNavbarCallback($scope.navBarCallback);
    }
}]);

app.controller('DropdownCtrl', ['$scope', function ($scope) {

    $scope.toggleDropdown = function ($event) {
        $event.stopPropagation();
    };
}]);

app.controller('UserCtrl', ['$scope', 'HttpSvc', function($scope, HttpSvc) {

    initUser();

    $scope.updateName = function(){
        console.log('test');
    };

    $scope.updatePicture = function(){
        console.log('test');
    };

    $scope.logout = function() {
        location.href="/logout";
    };

    function initUser() {
        HttpSvc.getProfile()
            .success(function (res) {
                if (res.success) {
                    $scope.username = res.profile.name;
                    $scope.useremail = res.profile.email;
                    $scope.profile_url = res.profile.profile_url;
                }
                else throw new Error;
            })
            .error(function (err) {
                console.log(err);
                // 다이얼로그(에러모듈) 처리
            });
    }

}]);