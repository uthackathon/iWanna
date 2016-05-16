'use strict'

app.controller('LoginCtrl', function($scope, $state, $ionicPopup, Auth,$ionicLoading){
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
            $scope.show();
            user = $scope.user;
            console.log('the user is ', user);
            Auth.login(user).then(function(){
            $scope.hide();
            console.log('user was registered successfully');
            $state.go('tab.dash');
            }, function(err) {
              $scope.hide();
              console.log('Error...', err);
            });
          }
        },
        {
          text: '<b>登録</b>',
          type: 'button-calm',
          onTap: function(user) {
            $scope.show();
            user = $scope.user;
            console.log('the user is ', user);
            Auth.register(user).then(function(){
            $scope.hide();
            console.log('user was registered successfully');
            $state.go('tab.dash');
            }, function(err) {
              $scope.hide();
              console.log('Error...', err);
            });
            // $state.go('tab.dash')

          }
        }
      ]
    });
  };

  //砂時計を表示
  $scope.show = function() {
    $ionicLoading.show({
    template: '<ion-spinner icon = "bubbles"></ion-spiner>'

  });
  };

  //砂時計を非表示
  $scope.hide = function() {
    $ionicLoading.hide();
  };
});
