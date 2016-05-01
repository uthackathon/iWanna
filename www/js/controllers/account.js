'use strict'

app.controller('AccountCtrl', function($scope, Auth){
  // $scope.settings = {
  //     enableFriends: false
  // };

 $scope.logout = function(){
   Auth.logout();
 }

});
