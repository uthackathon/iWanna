'use strict'

app.controller('MessageRoomCtrl', function(FURL,$scope,$state,Message,SharedStateServiceForMessage,uid,Wannas,$ionicLoading,SharedStateService){
	var ref = new Firebase(FURL);
	$scope.allMessages = [];
	$scope.friendImages ={'initUid':'initImg'};

	$scope.$watch(function(){
	  return SharedStateService.friendImages;
	}, function(){
	  $scope.friendImages = SharedStateService.friendImages;
	});
 	console.log('entered message room');

    $scope.friends=SharedStateServiceForMessage.chosenGroupMembers;
    $scope.members=SharedStateServiceForMessage.chosenGroupMembers;
    $scope.memberNum=Object.keys($scope.members).length;

    $scope.allFriendslist=[];
    for(var key in $scope.members){
        $scope.allFriendslist.push({'name': $scope.members[key],
                                    '$id':key});
    }

 	$scope.currentRoomId=SharedStateServiceForMessage.chosenRoomId;
    $scope.friendName=SharedStateServiceForMessage.chosenUserName;
 	console.log("ContentPage",$scope.chosenRoomId);

    $scope.dispToggle=function(messageUserId){
        if(messageUserId == uid){
            return "none";
        }else{
            return "inline";
        }
    };
	$scope.getImage=function(messageUserId){
		if(messageUserId == uid){
			return "img/white.png";
		}else{
			return $scope.friendImages[messageUserId];
		}
	};

 	$scope.sendMessage = function(){
 		var user = Wannas.getUserName(uid);
 		console.log(Wannas.getUserName(uid));

 		var message = $scope.data.message;
 		Message.sendMessage(message,uid,$scope.currentRoomId).then(function(){
	    $scope.data.message = "";//メッセージを消去
	  });
 	};

  $scope.readFlag=function(lastFlag){
    if(lastFlag){
    Message.alreadyRead($scope.currentRoomId,uid);
    }
  };

  $scope.$on('$ionicView.enter', function(e){
	console.log('ionicEnter Fired!!');
    $scope.show();
//    $scope.allMessages = [];
	var initMessages=[];
    Message.getAllMessages($scope.currentRoomId,uid).$loaded().then(function(data) {
		for (var i = 0; i < data.length; i++) {
				var item = data[i];
            initMessages.push(item);
			}
        $scope.hide();
		});
    $scope.allMessages = initMessages;
    $scope.hide();
  });

 	//firebaseのデーター構造に変化があった時（つまりメッセージを送信した時）に更新
 	ref.child('rooms').child($scope.currentRoomId).child('messages').on('child_added', function(dataSnapshot){
		console.log('child added Fired!!');
 		$scope.show();
//	    $scope.allMessages = []　//初期化。メッセージ更新のたびに初期化はまずい。。。。要訂正
		var initMessages=[];
   		Message.getAllMessages($scope.currentRoomId,uid).$loaded().then(function(data) {
            console.log("getAllMessages");
			for (var i = 0; i < data.length; i++) {
				var item = data[i];
				initMessages.push(item);
			}
		});
	    $scope.allMessages = initMessages;　//初期化。メッセージ更新のたびに初期化はまずい。。。。要訂正
	    $scope.hide();//エラーが出てたのでコメントアウトしてます
	});//これ、とくに問題なさそう。でも、これがionicView enter の前にメッセージの回数分だけfire されちゃうのはちょっと問題。


  $scope.isMe = function(userId){
    if(uid==userId){
　　　　return "self";
    }
  };
  $scope.isMembers = function(num){
    if(num){
      return {'display':'block'}
    }else{
      return {'display':'none'}
    }
  };
              //砂時計を表示
  $scope.show = function() {
    $ionicLoading.show({
    template: '<ion-spinner icon = "bubbles"></ion-spiner>'

    });
  };

  $scope.showMembers = function(){
    $state.go('tab.members');
  };

  $scope.referImage2 = function(friendUserId){
    console.log('refer image fired');
    if(friendUserId in $scope.friendImages){
      console.log('already gotten recommend');
    }else{
      $scope.friendImages[friendUserId]='img/loading.png';
      Wannas.imageAll(friendUserId).$loaded().then(function(images){
        console.log('got new image');
        console.log('friendId',friendUserId);
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

   //砂時計を非表示
  $scope.hide = function(){
    $ionicLoading.hide();
  };

})