'use strict'

app.controller('MessagesCtrl', function($state, $scope, Message, uid, SharedStateServiceForMessage,SharedStateService, $firebaseArray,FURL,$firebaseObject){
  $scope.friendImages ={'initUid':'initImg'};

  var ref = new Firebase(FURL);

  $scope.$watch(function(){
    return SharedStateService.friendImages;
  }, function(){
    $scope.friendImages = SharedStateService.friendImages;
  });

	$scope.AllRooms = Message.getAllRooms(uid);

  $scope.friendName = function(uid){
    return Auth.getProfile(uid).name;
  };

  $scope.goMessageRoom=function(roomId,friendName){
                  console.log("goMessageDetailPage button was clicked");
                  $state.go('tab.message-room');
                  //timeline.jsを参考にした
                  SharedStateServiceForMessage.chosenRoomId= roomId;
                  SharedStateServiceForMessage.chosenUserName= friendName;
                  $scope.chosenRoomId = roomId;
  };

  $scope.removeMessageRoom = function(roomId){
    return Message.removeMessages(roomId);
  }

});

 	// $scope.goContentPage=function(wanna){
  //                 console.log("goContent button was clicked");
  //                 $state.go('tab.wanna-content');
  //                 //ダッシュページと内容ページでWanna 情報をやりとりするためにSharedStateService に入れた値を共有する。
  //                 // http://whiskers.nukos.kitchen/2015/05/21/angularjs-controller-coordination.html のShared Service などを参考にした。
  //                 SharedStateService.clickedWanna=wanna;
  //                 $scope.clickedWanna=wanna;
  //                 console.log("timeline",wanna.content);
  //              };