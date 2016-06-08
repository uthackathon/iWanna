'use strict'

app.factory('Report', function(FURL, $firebaseAuth, $firebaseObject, $state, $firebaseArray,$ionicPopup) {
  var ref = new Firebase(FURL);

  var Report = {

    getUid: function() {
      return auth.$requireAuth()
        .then(function(auth){
          return auth.uid;
        });
    },

    reportProblem: function(reportId ,reportedId, problemType){
        var onComplete = function(error){
            if (error){
                var alertPopup = $ionicPopup.alert({
                    template: '通信が不安定です'
                });
            } else {
                var alertPopup = $ionicPopup.alert({
                    template: 'iWanna運営チームに報告されました'
                });
            }
        };
        //問題をrelationshipsの相手のuidのところに保存
        ref.child('relationships').child(reportedId).child('problems').child(reportId).child(problemType).set(true,onComplete);
    },

    blockUser: function(conductId ,blockedId){
        var onComplete = function(error){
            if (error){
                var alertPopup = $ionicPopup.alert({
                    template: '通信が不安定です'
                });
            } else {
                var alertPopup = $ionicPopup.alert({
                    template: 'ブロックしました'
                });
            }
        };
        var removeComplete = function(error){
            if (error){
                var alertPopup = $ionicPopup.alert({
                    template: '通信が不安定です'
                });
            } else {
                var alertPopup = $ionicPopup.alert({
                    template: '友達関係を削除しました'
                });
            }
        };
        //ブロック情報をrelationshipsの自分のuidのとこに保存
        ref.child('relationships').child(conductId).child('blocks').child(blockedId).set(true,onComplete);
        //友人関係の削除
        ref.child('follows').child(conductId).child(blockedId).remove();
        ref.child('follows').child(blockedId).child(conductId).remove();
        ref.child('followeds').child(conductId).child(blockedId).remove();
        ref.child('followeds').child(blockedId).child(conductId).remove();
        ref.child('matches').child(conductId).child(blockedId).remove();
        ref.child('matches').child(blockedId).child(conductId).remove(removeComplete);
    },

    muteUser: function(conductId,mutedId){
        var onComplete = function(error){
            if (error){
                var alertPopup = $ionicPopup.alert({
                    template: '通信が不安定です'
                });
            } else {
                var alertPopup = $ionicPopup.alert({
                    template: 'ミュートしました'
                });
            }
        };
//        if(window.localStorage){
            console.log('ローカルストレージに対応していません。サーバーにミュート情報を保管します');
            ref.child('users').child(conductId).child('mutes').child(mutedId).set(true,onComplete);
//        }else{
//            console.log('ミュートしました');
//            window.localStorage.setItem(mutedId,true);
//        }
    },

    unMuteUser: function(conductId,mutedId){
        var onComplete = function(error){
            if (error){
                var alertPopup = $ionicPopup.alert({
                    template: '通信が不安定です'
                });
            } else {
                var alertPopup = $ionicPopup.alert({
                    template: 'ミュートを解除しました'
                });
            }
        };
//        if(window.localStorage){
            console.log('ローカルストレージに対応していません。サーバーにミュート情報を削除します');
            ref.child('users').child(conductId).child('mutes').child(mutedId).remove(onComplete);
//        }else{
//            console.log('ミュートしました');
//            window.localStorage.setItem(mutedId,true);
//        }
    },



    getMyMutes: function(currentUid){
        return $firebaseObject(ref.child('users').child(currentUid).child('mutes'));
    },










  };
  return Report;

});
