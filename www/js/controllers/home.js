'use strict'

app.controller('HomeCtrl', function($scope, Auth, $state, uid, $cordovaScreenshot, SocialShare){

	$scope.accountInformation = Auth.getProfile(uid);

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
    $state.go('tab.twitter-share');//state.goディレクトリ関係がわからない
  };


 	$scope.logout = function(){

   	Auth.logout();
 	}
})