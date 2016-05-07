'use strict'

app.controller('HomeCtrl', function($scope, Auth, $state, uid, $cordovaScreenshot, SocialShare,Wannas){

	$scope.accountInformation = Auth.getProfile(uid);

  $scope.allWannasList = Wannas.all(uid);

  // $scope.twitterShare=function(){

  // 	console.log("twitter")
		// SocialShare.shareViaTwitter('test',null,"test/url");
  // }

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
  },

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