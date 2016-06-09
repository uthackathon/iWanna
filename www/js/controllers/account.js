'use strict'

app.controller('AccountCtrl', function($scope, Auth, uid, ImageUpload, FURL, $firebaseArray,$cordovaInAppBrowser,$state){

	$scope.accountInformation = Auth.getProfile(uid);
    var fb = new Firebase(FURL);
    var ref = $firebaseArray(fb.child("users").child(uid).child("images"));
    $scope.images = ref;
    $scope.uploadPic = function(file){
      return ImageUpload.uploadPic(file,ref);
    };

    $scope.editIntro = function(){
        document.getElementById('into').style.display="none";
        document.getElementById('introedit').style.display="inline";
    }

    $scope.image_remove = function(){
        return ImageUpload.image_all_remove(ref);
    };

 	$scope.logout = function(){

   	Auth.logout();
 	};

    $scope.termsOfUse = function(){
    $state.go('tab.terms-of-use');
    };

    $scope.aboutUTH = function()
    {
    var options = {
          location: 'yes',
          clearcache: 'yes',
          toolbar: 'yes'
        };

        $cordovaInAppBrowser.open('http://ut-hackathon.strikingly.com', '_system',options)//ほんとうは _blank のオプションで開きたい
            .then(function(event) {
            // success
        })
            .catch(function(event) {
            // error
        });

        // Open cordova webview if the url is in the whitelist otherwise opens in app browser
//        var ref = cordova.InAppBrowser.open('http://ut-hackathon.strikingly.com','_blank');
    };



})