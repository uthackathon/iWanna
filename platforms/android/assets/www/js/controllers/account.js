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
        return ImageUpload.image_all_remove(ref);
    };

 	$scope.logout = function(){

   	Auth.logout();
 	};

    $scope.aboutUTH = function()
    {
        // Open cordova webview if the url is in the whitelist otherwise opens in app browser
        var ref =window.open('http://ut-hackathon.strikingly.com','_blank');
        ref.addEventListener('loadstart', function(event) { alert('start: ' + event.url); });
        ref.addEventListener('loadstop', function(event) { alert('stop: ' + event.url); });
        ref.addEventListener('loaderror', function(event) { alert('error: ' + event.message); });
        ref.addEventListener('exit', function(event) { alert(event.type); });

    };

})