'use strict'

app.controller('HomeCtrl', function($scope, Auth, uid, SocialShare){

	$scope.accountInformation = Auth.getProfile(uid);

    $scope.twitterShare=function(){
    	console.log("twitter")
  		SocialShare.shareViaTwitter('test',null,"test/url");
    }

 	$scope.logout = function(){

   	Auth.logout();
 	}
})