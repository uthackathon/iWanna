'use strict'

app.controller('AccountCtrl', function($scope, Auth, uid, $cordovaSocialSharing){

	$scope.accountInformation = Auth.getProfile(uid);

	// $scope.shareViaTwitter = function(message, image, link) {
 //        $cordovaSocialSharing.prototype.canShareVia("twitter", message, image, link).then(function(result) {
 //            $cordovaSocialSharing.prototype.shareViaTwitter(message, image, link);
 //        }, function(error) {
 //            alert("Cannot share on Twitter");
 //        });
 //    }
    $scope.twitterShare=function(){
    	console.log("twitter")
    window.plugins.socialsharing.shareViaTwitter('this is test', null /* img */, 'https://test', null, function(errormsg){alert("Error: Cannot Share")});
  	}

 	$scope.logout = function(){

   	Auth.logout();
 }

});
