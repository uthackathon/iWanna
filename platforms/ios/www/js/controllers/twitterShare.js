'use strict'

app.controller('TwitterShareCtrl', function($scope, Auth, uid, $cordovaScreenshot, SocialShare, Wannas){
  $scope.allWannasList = Wannas.all(uid);
  $scope.screenShotShareViaTwitter = function(){


    $cordovaScreenshot.capture()
    .then(function(result) {
          //on success you get the image url

          //post on facebook (image & link can be null)
          
            SocialShare.shareViaTwitter("Text to post here...", result, "Link to share")
                  .then(function(result) {
                        //do something on post success or ignore it...
                   }, function(err) {
                        console.log("there was an error sharing!");
                   });
     }, function(err) {
         console.log("there was an error taking a a screenshot!");
    });
  }

})