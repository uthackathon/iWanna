'use strict'

app.factory('SocialShare', function($cordovaSocialSharing) {

  var SocialShare = {


    shareViaTwitter: function(text,img,url){
      console.log("twitter")
      window.plugins.socialsharing.shareViaTwitter(text, img, url, null, function(errormsg){alert("Error: Cannot Share")});
 }
  };
  return SocialShare;
});