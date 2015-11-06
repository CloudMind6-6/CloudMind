app.controller('GetUserCtrl', ['$scope', 'HttpSvc', function($scope, HttpSvc) {
	$scope.logout = function() {
		location.href="/logout";
	};

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
}]);

