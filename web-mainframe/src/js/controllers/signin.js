'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.authError = null;
    $scope.login = function() {
        $state.go('app.list');
  }
}])
;