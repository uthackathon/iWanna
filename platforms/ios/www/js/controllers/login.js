'use strict'

app.controller('LoginCtrl', function($scope, $state, $ionicPopup, Auth){
  $scope.emailLogin = function(){
    console.log('buttun was clicked on login');

    $scope.user = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/partials/login.html',
      title: 'Signin',
      scope: $scope,
      buttons: [
        {
          text: '<b>Login</b>',
          type: 'button-energized',
          onTap: function(user) {
            user = $scope.user;
            console.log('the user is ', user);
            Auth.login(user).then(function(){
            console.log('user was registered successfully');
            $state.go('tab.dash');
            }, function(err) {
              console.log('Error...', err);
            });
          }
        },
        {
          text: '<b>登録</b>',
          type: 'button-calm',
          onTap: function(user) {
            user = $scope.user;
           
            console.log('the user is ', user);
            Auth.register(user).then(function(){
            console.log('user was registered successfully');
            $state.go('tab.dash');
            }, function(err) {
              console.log('Error...', err);
            });
            // $state.go('tab.dash')

          }
        }
      ]
    });
  };
});
