'use strict'

app.controller('AccountCtrl', function($scope, Auth, uid){

	$scope.accountInformation = Auth.getProfile(uid);

 	$scope.logout = function(){
   	Auth.logout();
 }

});
