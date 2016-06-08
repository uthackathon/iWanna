'use strict'

app.controller('FriendHomeCtrl', function($scope,Report, Auth, $state, uid, $cordovaScreenshot, SocialShare, Wannas, ImageUpload, FURL, $firebase, $firebaseArray,SharedStateService,$ionicActionSheet,$ionicPopup){
  $scope.friendImages ={'initUid':'initImg'};
  $scope.currentUid=uid;
  $scope.$watch(function(){
    return SharedStateService.friendImages;
  }, function(){
    $scope.friendImages = SharedStateService.friendImages;
  });

  $scope.clickedFriendId=SharedStateService.clickedFriendId;//SharedStateService からクリックした友人のID を取得
  $scope.clickedFriendName=SharedStateService.clickedFriendName;//SharedStateService からクリックした友人のID を取得



  $scope.allWannasList = Wannas.all($scope.clickedFriendId);

  $scope.goContentPage=function(wanna){
    console.log("goContent button was clicked");
    $state.go('tab.wanna-content');
    SharedStateService.clickedWanna=wanna;
    $scope.clickedWanna=wanna;
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