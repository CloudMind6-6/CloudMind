'use strict';

/* Controllers */
  // signin controller
app.controller('SigninFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.authError = null;

  //   $scope.login = function() {
  //    auth2.grantOfflineAccess({'redirect_uri': 'postmessage'}).then(signInCallback);
  //       //$state.go('app.list');
    // }

    $scope.processAuth = function(authResult) {
        // Do a check if authentication has been successful.
        console.log(authResult);
        if(authResult['access_token']) {
            // Successful sign in.
            $scope.signedIn = true;
            $("#signInButton").hide();
            $state.go('app.list');
            //     ...
            // Do some work [1].
            //     ...
        } else if(authResult['error']) {
            // Error while signing in.
            $scope.signedIn = false;
            $state.go('access.signin');
            // Report error.
        }
    };
 
    // When callback is received, we need to process authentication.
    $scope.signInCallback = function(authResult) {
        $scope.$apply(function() {
            $scope.processAuth(authResult);
        });
    };
 
    // Render the sign in button.
    $scope.renderSignInButton = function() {
        gapi.signin.render('signInButton',
            {
                'callback': $scope.signInCallback, // Function handling the callback.
                'clientid': '863887952859-ol5bukmc38lkmfa82usslterdrrol4lc.apps.googleusercontent.com', // CLIENT_ID from developer console which has been explained earlier.
                'requestvisibleactions': 'http://schemas.google.com/AddActivity', // Visible actions, scope and cookie policy wont be described now,
                                                                                  // as their explanation is available in Google+ API Documentation.
                'scope': 'profile',
                'cookiepolicy': 'single_host_origin'
            }
        );
    }
 
    // Start function in this example only renders the sign in button.
    $scope.start = function() {
        $scope.renderSignInButton();
    };
 
    // Call start function on load.
    $scope.start();
}])
;