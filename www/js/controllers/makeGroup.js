'use strict'

app.controller('MakeGroupCtrl', function($state, $scope, Message, uid, SharedStateServiceForMessage,SharedStateService, $firebaseArray,FURL,$firebaseObject,$ionicActionSheet,Wannas,Match,$ionicPopup){
  $scope.friendImages ={'initUid':'initImg'};

  var ref = new Firebase(FURL);


  var groupMemberId=[uid];
  $scope.groupMemberObject={};
  $scope.groupMemberObject[uid]="me";//友人id:名前 というオブジェクトをつくる
  var reservedId={};
  //iWから作るために、likeしている人データなどの抽出と代入。名前が取得され次第addMemberされるように、予約名簿reservedIdに代入(uid:trueの連想配列)
  if(SharedStateService.groupWanna){//ゼロから作るときはgroupWanna=0だからスルー
    reservedId=SharedStateService.groupWanna.likes;
    $scope.groupName=SharedStateService.groupWanna.content;
  }
  //抽出おわり

  $scope.$watch(function(){
    return SharedStateService.friendImages;
  }, function(){
    $scope.friendImages = SharedStateService.friendImages;
  });


  Match.allMatchesByUser(uid).$loaded().then(function(data) {//friendのidの取得
      var friendsID=[];
      for (var i = 0; i < data.length; i++) {
        friendsID.push({'id':data[i].$id,
                        'name':'Loading...',
                        'nameToggle':0});
      };
      $scope.allFriends=friendsID;

  });
  $scope.referImageAndName = function(friend){
    var friendUserId=friend.id;
    //名前の取得
    Wannas.getObjectUserName(friendUserId).$loaded().then(function(obj){
      var userName=obj.$value;
      friend['name']=userName;
      friend['nameToggle']=1;//名前取得済みのフラグ
      if(friendUserId in reservedId){//予約名簿(Likeしてる人名簿)にあったら、addMemberする
        $scope.addMember(friend);
      }

    });
    //以下、画像の取得
    if(friendUserId in $scope.friendImages){
      console.log('already gotten');
    }else{
      $scope.friendImages[friendUserId]='img/loading.png';
      Wannas.imageAll(friendUserId).$loaded().then(function(images){
        console.log('got new image');
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

  $scope.addMember=function(friend){//選択したフレンドのidをメンバーに追加
    var friendUserId=friend.id;
    var num=groupMemberId.indexOf(friendUserId);
    if(num==-1){//グループのメンバーidに入ってないとき
      groupMemberId.push(friendUserId);
      $scope.groupMemberObject[friendUserId]=friend.name;
    }else{//入ってる時
      groupMemberId.splice(num, 1);
      delete $scope.groupMemberObject[friendUserId];
    }//メンバーidはアレイで、メンバーidオブジェクトは連想配列であるので注意
  };

  $scope.isName=function(flag){
    if(flag){//名前取れてるとき
      return {'display':'block'}//表示
    }else{
      return {'display':'none'}//非表示
    }
  }

  $scope.isMember=function(friendUserId){
    var num=groupMemberId.indexOf(friendUserId);
    if(num==-1){//グループのメンバーidに入ってないとき
      return {'display':'none'}//非表示
    }else{
      return {'display':'block'}//表示
    }
  };
$scope.result=0;
  $scope.makeNewGroup=function(groupName){
    console.log('groupName',groupName);
    if(groupName == "" || groupName == null){//グループ名が未定義だったり一度入力して消されているとき
      var alertPopup = $ionicPopup.alert({
        title: 'エラー',
        template: 'グループ名を決めましょう！'
      });
    }else{
      Wannas.getObjectUserName(uid).$loaded().then(function(obj){
        var myName=obj.$value;//自分の名前も忘れず取得
        $scope.groupMemberObject[uid]=myName;
        Message.createNewGroup(groupName,groupMemberId,$scope.groupMemberObject);
        $state.go('tab.messages');
      });
    }
  };

});