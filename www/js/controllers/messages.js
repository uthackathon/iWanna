'use strict'

app.controller('MessagesCtrl', function($state, $scope, Message, uid, SharedStateServiceForMessage,SharedStateService, $firebaseArray,FURL,$firebaseObject,$ionicActionSheet,Wannas){
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

  $scope.getFriendGroupImages=function(friendId){
    if(friendId==null ||friendId==""){//グループの場合
      return "img/iw_gray.png"
    }else{
      return $scope.friendImages[friendId]
    }
  };

  $scope.makeGroup = function() {
    $ionicActionSheet.show({
    buttons: [
    { text: '新しいグループを作成する' },
    { text: 'iW からグループを作成する'},
    ],
    cancelText: 'Cancel',
    cancel: function() {
    console.log('CANCELLED');
    },
    buttonClicked: function(index) {
        if (index == 0){
            console.log('new group');
            SharedStateService.groupWanna=0;
            $state.go('tab.make-group');
        }else if(index==1){
            console.log('new wanna group');
            $state.go('tab.make-wannaGroup');
        }
          return true;
        },
    });
  };


  $scope.referImage = function(friendUserId){
    if(friendUserId==null || friendUserId=="" ){//グループの時ないからreturn でスルーする
        return
    }
    if(friendUserId in $scope.friendImages){
      console.log('already gotten');
    }else{
      $scope.friendImages[friendUserId]='img/loading.png';
      Wannas.imageAll(friendUserId).$loaded().then(function(images){
      if(images[0]==null){console.log('undefined');
      $scope.friendImages[friendUserId]='img/iw_gray.png';
      }else{
      $scope.friendImages[friendUserId]=images[0]['images'];
      }
      },function(error){
      console.log('oh no! no images file');
      });
    }
  };



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