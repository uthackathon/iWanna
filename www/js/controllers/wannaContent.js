'use strict'

app.controller('WannaContentCtrl', function(uid,$scope,$state,SharedStateService,Wannas,Message,$ionicActionSheet,$ionicPopup,Report) {
               console.log('entered content page');
               //タイムラインでクリックしたwanna 情報の読み取り(Shared Service 経由で)
               $scope.clickedWanna=SharedStateService.clickedWanna;
               var likedUsersId=$scope.clickedWanna.likes;
               var idArray=[];
               var roomList = [];
               for(var key in likedUsersId){
                   idArray.push(key);
               };
               $scope.likedUsers=[];

               console.log("ContentPage",$scope.clickedWanna.content);
               $scope.friendImages ={'initUid':'initImg'};
               var currentUid=uid;
               $scope.$watch(function(){
                     return SharedStateService.friendImages;
                   }, function(){
                     $scope.friendImages = SharedStateService.friendImages;
               });
               $scope.likeNum=Object.keys($scope.clickedWanna.likes).length -1 ;//イニシャライズの分を1つ引く
               console.log("the number of likes",$scope.likeNum);

               $scope.$watch('clickedWanna',function(){
                if(currentUid in $scope.clickedWanna.likes){
                    var likeButton = document.getElementById('likeInContent');
                    likeButton.style.backgroundColor='#FFFFFF';
                    likeButton.style.color='#FFC0CB';
                }
               });

               $scope.extract=function(idArray){
                    if(idArray.length>1){
                    var oneID=idArray[0];//ひとつ目のライクした人のid を取得
                    Wannas.getObjectUserName(oneID).$loaded().then(function(obj){
                      var name = obj.$value;
                      console.log('name',name);
                      if(name){
                         console.log('Writing');
                         $scope.likedUsers.push({'name': name,
                         'id': oneID});
                         idArray.shift();//ひとつめを削除
                         console.log('idArray',idArray);
                         $scope.extract(idArray);//減ったidArrayでまた始める
                      }
                    });
                    }else{
                        console.log('end of like users');
                    }
               };

               $scope.showLikedUsers=function(){
                 $scope.extract(idArray);
                 console.log('show liked users');
//                 var likeBoard=document.getElementById('likeBoard');
//                 likeBoard.style.visibility="visible";
               }

               $scope.date = function(dayInt){
                  var dayString = String(dayInt);
                  var month = Number(dayString.substr(4,2));
                  var day = Number(dayString.substr(6,2));
                  var hour = Number(dayString.substr(8,2));
                  var min = Number(dayString.substr(10,2));
                  var date = month+"月"+day+"日 "+hour+"時"+min+"分";
                  return date;
                }

                $scope.likeWannaInContent=function(wanna){
                    console.log("like button was clicked");
                    var likeButton = document.getElementById('likeInContent');
                    var buttonColor=likeButton.style.color;
                    console.log("button color",buttonColor);
                    if(buttonColor=='rgb(255, 192, 203)'){//likeボタンがすでに色つきの時(like してるとき)
                        console.log("colorful");
                        Wannas.removeLikeFromWanna(wanna.ownerId,wanna.$id,currentUid,likeButton);
                        Wannas.removeLikeFromUser(wanna.ownerId,wanna.$id,currentUid,likeButton);
                    }else{//likeにまだ色がついてない時(like してないとき)
                        Wannas.addLikeToWanna(wanna.ownerId,wanna.$id,currentUid,likeButton);
                        Wannas.addLikeToUser(wanna.ownerId,wanna.$id,currentUid,likeButton);

                            //はい or いいえが欲しい
                            console.log(_.contains(_.pluck(roomList, 'friendId'),wanna.ownerId));
                            if(_.contains(_.pluck(roomList, 'friendId'),wanna.ownerId)){//すでに友達とのroomが存在するとき
                              var likedRoomId = roomList[_.indexOf(_.pluck(roomList, 'friendId'),wanna.ownerId)].roomId
                              var message = "Me Too!!! ; " + wanna.content ;
                              Message.sendMessage(message,uid,likedRoomId);
                            }
                            else{
                              console.log("create new messgage room")
                              var message = "Me Too!!! ; " + wanna.content ;
                              Message.createNewRoomWithMessage(uid,wanna.ownerId,message);
                              // var message = "Hi! I like your plan; " + wanna.content ;
                              // Message.sendMessage(message,uid,likedRoomId);
                            }

                    }

               };

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


})
