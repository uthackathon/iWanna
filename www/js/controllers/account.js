'use strict'

app.controller('AccountCtrl', function($scope, Auth, uid, ImageUpload, FURL, $firebaseArray){

	$scope.accountInformation = Auth.getProfile(uid);

    var fb = new Firebase(FURL);
    var ref = $firebaseArray(fb.child("users").child(uid).child("images"));
    $scope.images = ref;
    $scope.uploadPic = function(file){
      return ImageUpload.uploadPic(file,ref);
    };
    $scope.image_remove = function(){
        return ImageUpload.image_all_remove();
    };

 	$scope.logout = function(){

   	Auth.logout();
 	}
})