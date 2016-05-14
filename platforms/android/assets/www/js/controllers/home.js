'use strict'

app.controller('HomeCtrl', function($scope, Auth, $state, uid, $cordovaScreenshot, SocialShare,Wannas, $firebase, $firebaseArray, Upload, $timeout, FURL){

	$scope.accountInformation = Auth.getProfile(uid);

  $scope.allWannasList = Wannas.all(uid);

  // $scope.twitterShare=function(){

  // 	console.log("twitter")
		// SocialShare.shareViaTwitter('test',null,"test/url");
  // }

    var fb = new Firebase(FURL);
    //var fb = new Firebase("https://imageuptestiwanna.firebaseio.com/");
    var ref = fb.child("users").child(uid).child("images");
    var sync = $firebaseArray(ref);
    var syncArray = $firebaseArray(fb.child("users").child(uid).child("images"));
    // ストアされたjson objectをmodelにバインド
    $scope.images = sync;
    $scope.uploadPic = function(file) {
      var images = Upload.base64DataUrl(file).then(function(base64Urls){
        $timeout(function () { file.result = base64Urls.data; });
        // 同期配列にArray.push
        syncArray.$add({images : base64Urls})
        .then(function(error) {
          if (error) { console.log("Error:",error);
          } else { console.log("Post set successfully!");
          }
        });
      });
    };
    // 画像全削除
    $scope.image_all_remove = function(){
      angular.forEach($scope.images, function(img, i){
        var row = $scope.images.$getRecord($scope.images[i].$id);
        $scope.images.$remove(row);
      });
    };

   $scope.screenShotShare = function(){
    $cordovaScreenshot.capture()
     .then(function(result) {
          //on success you get the image url
          //post on facebook (image & link can be null)

            SocialShare.shareViaTwitter("Text to post here...", result, "url")
                  .then(function(result) {
                        //do something on post success or ignore it...
                   }, function(err) {
                        console.log("there was an error sharing!");
                   });
     }, function(err) {
         console.log("there was an error taking a a screenshot!");
    });
  };

  $scope.twitterShare = function(){
    console.log("write button was clicked");
    $state.go('twitter-share');//state.goディレクトリ関係がわからない
  };

  $scope.facebookShare = function(){
    console.log("write button was clicked");
    $state.go('facebook-share');//state.goディレクトリ関係がわからない
  };

 	$scope.logout = function(){

   	Auth.logout();
 	}
})