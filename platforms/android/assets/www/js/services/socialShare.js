'use strict'

app.factory('SocialShare', function($cordovaSocialSharing) {

  var SocialShare = {


    shareViaTwitter: function(text,img,url){
      console.log("twitter")
      fileName = "content:/" + img
      window.plugins.socialsharing.shareViaTwitter(text, fileName, url, null, function(errormsg){alert("Error: Cannot Share Via Twitter")});
 	},
 	shareViaFacebook: function(text,img,url){
      console.log("facebook")
      fileName = "content:/" + img
      window.plugins.socialsharing.shareViaFacebook(text, fileName, url, null, function(errormsg){alert("Error: Cannot Share Via Facebook")});
 	}
  };
  return SocialShare;
});