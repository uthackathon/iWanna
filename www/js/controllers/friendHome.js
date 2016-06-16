'use strict'

app.controller('FriendHomeCtrl', function(Message,Match,$scope,Report, Auth, $state, uid, $cordovaScreenshot, SocialShare, Wannas, ImageUpload, FURL, $firebase, $firebaseArray,SharedStateService,$ionicActionSheet,$ionicPopup){
  $scope.friendImages ={'initUid':'initImg'};
  $scope.currentUid=uid;
  $scope.recommendedImages={};
  $scope.myFriendsId={};
  $scope.friendDataStore=0;
  $scope.clickedFriendId=SharedStateService.clickedFriendId;//SharedStateService からクリックした友人のID を取得
  $scope.clickedFriendName=SharedStateService.clickedFriendName;//SharedStateService からクリックした友人のID を取得
  Wannas.all($scope.clickedFriendId).$loaded().then(function(data){
    $scope.allWannasList = data;
    $scope.allWannasList.reverse();
    $scope.showingWannasList = $scope.allWannasList;
  });



  var friendNumFlag=20;//フレンドの初期表示人数
  $scope.$watch(function(){
    return SharedStateService.friendImages;
  }, function(){
    $scope.friendImages = SharedStateService.friendImages;
  });


  $scope.profiles=[{'name':'Loading','$id':'loadingId',}];

  $scope.followOrSendMessage = function(profile){
    if(profile.icon == 'ion-paper-airplane'){//send messageのアイコンの場合
        $scope.createRoom(profile.$id);
    }else if(profile.icon == 'ion-person-add'){//フレンドリクエストアイコンの場合
        $scope.follow(profile.$id);
    }
  };

  $scope.createRoom = function(friend_uid){
    Message.createNewRoom(uid,friend_uid);
    $state.go('tab.messages');
  }

  $scope.follow = function(follow_uid) {
      var confirmPopup = $ionicPopup.confirm({
         title: 'Friend',
         template: 'Send Friend Request'
      });
      confirmPopup.then(function(res) {
        if(res) {
          Follow.addFollow(uid, follow_uid);
          Followed.addFollowed(follow_uid, uid);
          Match.checkMatch(uid, follow_uid);
          //$scope.cardRemove(index);
          console.log("FOLLOW");
        } else {
          console.log('You are not sure');
        }
      });
  		//console.log("FOLLOW")
  },


  $scope.goContentPage=function(wanna){
    console.log("goContent button was clicked");
    $state.go('tab.wanna-content');
    SharedStateService.clickedWanna=wanna;
    $scope.clickedWanna=wanna;
  };
  $scope.messagePopup =function(){
    $scope.createRoom($scope.clickedFriendId);
  };

  $scope.referImage = function(profile){
      //console.log('ids',profile.$id);
      if(profile.blocks){}else{profile.blocks={};}
      if(uid in profile.blocks){
        profile.disp={'display':'none'};
        profile.icon=  'ion-android-alert';
      }else if(profile.$id == uid){
        profile.disp={'display':'none'};
        profile.icon=  'ion-android-alert';
      }else if(profile.$id in $scope.myFriendsId){
        profile.disp={'display':'none'};
        profile.icon=  'ion-android-alert';
//send massageいらないかも        profile.icon= 'ion-paper-airplane';
      }else{
        profile.icon=  'ion-person-add';
      }
      var friendUserId=profile.$id;
      //console.log('refer image fired');
      if(friendUserId in $scope.recommendedImages){
      console.log('already gotten recommend');
      }else{
      $scope.recommendedImages[friendUserId]='img/loading.png';
      Wannas.imageAll(friendUserId).$loaded().then(function(images){
      console.log('got new image');
      //console.log('friendId',friendUserId);
      if(images[0]==null){console.log('undefined');
      $scope.recommendedImages[friendUserId]='img/iw_gray.png';
      }else{
      $scope.recommendedImages[friendUserId]=images[0]['images'];
      }
      },function(error){
      console.log('oh no! no images file');
      });
      }
  };

  $scope.completeToggle=function(complete){//コンプリートマークの有無を返す
    if(complete){
        return {'display':'block'}
    }else{
        return {'display':'none'}
    }
  };

  $scope.showFriends=function(){
      document.getElementById('wannaList').style.display="none";
      document.getElementById('friendList').style.display="block";
      Match.allMatchesByUserObject(uid).$loaded().then(function(mydata) {//自分の友人を取得(すでに友達の友達が自分のfriendsに入っているか判定するため)
          $scope.myFriendsId =mydata;
          Match.allMatchesByUser($scope.clickedFriendId).$loaded().then(function(data) {
            $scope.friendDataStore=data;//moreで増やすように一時保管
            var allFriends=[];
            if(friendNumFlag>$scope.friendDataStore.length){//フレンドの表示数が実際のデータ長より大きければmoreボタンを消して数をデータ長にfit
                friendNumFlag=$scope.friendDataStore.length;
                document.getElementById('moreButton').style.display="none";
            }
            for (var i = 0; i < friendNumFlag; i++) {
                //console.log('is',i);
                var item = data[i];
                Auth.getUserRelation(item.$id).$loaded().then(function(profile) {
                allFriends.push(profile);
              });
            }

            $scope.profiles =allFriends;
          });
      });
  };

  $scope.moreFriend=function(){//フレンドをさらに表示するときのボタン
            friendNumFlag =friendNumFlag+10;//さらに表示する個数をたす。
            if(friendNumFlag>$scope.friendDataStore.length){
                friendNumFlag=$scope.friendDataStore.length;
                document.getElementById('moreButton').style.display="none";
            }
            for (var i = $scope.profiles.length; i < friendNumFlag; i++) {
                console.log('is',i);
                var item = $scope.friendDataStore[i];
                Auth.getUserRelation(item.$id).$loaded().then(function(profile) {
                $scope.profiles.push(profile);
              });
            }
  };

  $scope.defaultWanna= function(){
      document.getElementById('wannaList').style.display="block";
      document.getElementById('friendList').style.display="none";
      $scope.showingWannasList=$scope.allWannasList;
  };

  $scope.showCompletes= function(){
      document.getElementById('wannaList').style.display="block";
      document.getElementById('friendList').style.display="none";
      var initList=[];
      for(var i =0;i<$scope.allWannasList.length;i++){
        if($scope.allWannasList[i].complete==1){
          initList.push($scope.allWannasList[i]);
        }
      }
      $scope.showingWannasList=initList;
  };


//  $scope.$on('$ionicView.enter', function(e){
//    // $scope.show();
//    AdMobService.showBannerAd()
//    // $scope.hide();
//  });

//    var fb = new Firebase(FURL);
//    var ref = $firebaseArray(fb.child("users").child(uid).child("images"));
//    $scope.images = ref;
//    $scope.uploadPic = function(file){
//      return ImageUpload.uploadPic(file,ref);
//    }


  //オプションボタンでポップアップ
  $scope.report = function(friendName,friendId) {

    $ionicActionSheet.show({
//    titleText: 'Report',
    buttons: [
    { text: '問題を報告する' },
    { text: 'このユーザーをミュートする'},
    { text: 'このユーザーをブロックする'},
    ],
//    destructiveText: '<i class="icon ion-trash-a assertive"></i> Delete',
    cancelText: 'Cancel',
    cancel: function() {
    console.log('CANCELLED');
    },
    buttonClicked: function(index) {
        if (index == 0){
            $scope.problemDetail(friendId);
//          console.log('SEND MESSAGE CLICKED', index);
        }else if(index==1){
            $scope.muteConfirm(friendName,friendId);
        }else if(index==2){
            $scope.blockConfirm(friendName,friendId);
        }

          return true;
        },
    });
  };


    $scope.problemDetail = function(friendId) {
        $ionicActionSheet.show({
        titleText: '報告内容を選択してください',
        buttons: [
        { text: '不適切もしくは攻撃的なコンテンツがあります' },
        { text: 'アカウントが乗っ取られている可能性があります'},
        { text: 'スパムアカウントです' },
        { text: 'その他の問題があります'},
        ],
        cancelText: 'Cancel',
        cancel: function() {
        console.log('CANCELLED');
        },
        buttonClicked: function(index) {
            var problemType=0;
            if (index == 0){
                console.log('不適切で報告 User ID',friendId);
                problemType='inappropriate';
            }else if(index==1){
                console.log('乗っ取りで報告 User ID',friendId);
                problemType='takeover';
            }else if(index==2){
                console.log('スパムで報告 User ID',friendId);
                problemType='spam';
            }else if(index==3){
                console.log('その他の問題で報告 User ID',friendId);
                problemType='other';
            }
            Report.reportProblem(uid,friendId, problemType);
            return true;
            },
        });
    };

    $scope.muteConfirm = function(friendName,friendId) {
        var confirmPopup = $ionicPopup.confirm({
        title: '友達のミュート',
        template: friendName + 'さんをミュートしますか？ OKを押すと' +friendName+ 'さんの投稿がiW Listに表示されなくなります。'
        });

        confirmPopup.then(function(res) {
         if(res) {
           console.log(friendName,'さんをミュート UserID',friendId);
           Report.muteUser(uid,friendId);
         } else {
           console.log('You are not sure');
         }
        });
    };

    $scope.blockConfirm = function(friendName,friendId) {
        var confirmPopup = $ionicPopup.confirm({
        title: '友達のブロック',
        template: friendName + 'さんをブロックしますか？ OKを押すと' +friendName+ 'さんはフレンドリストから削除され、あなたへのFriend Requestを送ることができなくなります。'
        });

        confirmPopup.then(function(res) {
         if(res) {
           console.log(friendName,'さんをブロック UserID',friendId);
           Report.blockUser(uid ,friendId);
         } else {
           console.log('You are not sure');
         }
        });
    };





 	$scope.logout = function(){

   	Auth.logout();
 	}
})