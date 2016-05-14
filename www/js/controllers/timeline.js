'use strict'

app.controller('DashCtrl', function(uid,$scope,$state,Wannas,SharedStateService,Match,$timeout) {
               //ログインする前に uid を参照しようとするとエラーとなるので注意。
               //エラー処理については http://uhyohyo.net/javascript/9_8.html
               //ログインする前にuid は使えないので、エラー処理を入れた。(結局、抜いた)

               var currentUid = uid;
               var allwanna = Wannas.all(currentUid);
               var friendidList = [];
               var likedWannaList=[];

                Match.allMatchesByUser(uid).$loaded().then(function(data) {
                //$loadedを使わないとlengthが正常動作しない（違うとこのlengthを参照する）
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        friendidList.push(item.$id);
                        Wannas.all(item.$id).$loaded().then(function(friendwanna) {
                            //console.log(friendwanna.length);
                            for (var j = 0; j < friendwanna.length; j++) {
                                allwanna.push(friendwanna[j]);
                                //console.log(friendwanna[j]);
                            }
                        });
                    }
                    console.log("allwanna is",allwanna);
                    console.log("friend ids are",friendidList);
                });



               $scope.wannas = allwanna;

               $scope.writeWanna=function(){
               console.log("write button was clicked");
               $state.go('tab.submit');//state.goディレクトリ関係がわからない
               };

               $scope.goContentPage=function(wanna){
                  console.log("goContent button was clicked");
                  $state.go('tab.wanna-content');
                  //ダッシュページと内容ページでWanna 情報をやりとりするためにSharedStateService に入れた値を共有する。
                  // http://whiskers.nukos.kitchen/2015/05/21/angularjs-controller-coordination.html のShared Service などを参考にした。
                  SharedStateService.clickedWanna=wanna;
                  $scope.clickedWanna=wanna;
                  console.log("timeline",wanna.content);
               };

               $scope.myFunction = function(isLast,wanna){
                 if(isLast){//html の表示が終わった時に動く内容 （like の色付け）
                    console.log("the end of repeat",wanna.$id);

                   $timeout(function(){
                    likedWannaList=Wannas.findUsersLikes($scope.wannas,currentUid);
                    for(var i = 0; i < likedWannaList.length; i++){
                        var pretarget = document.getElementById(likedWannaList[i]);
                        pretarget.style.backgroundColor='#FFFFFF';
                        pretarget.style.color='#FFC0CB';
                    }
                   },500);

                 }
               };


               $scope.likeWanna=function(wanna){
                      console.log("like button was clicked");
                     // wanna.ownerId=currentUid;//test用の緊急処理。wanna 全てにownerId を書き込んでこの行を消すべし
                     var pretarget = document.getElementById(wanna.$id);
                                                pretarget.style.backgroundColor='#FFFFFF';
                                                pretarget.style.color='#FFC0CB';

                      Wannas.addLike(wanna.ownerId,wanna.$id,currentUid)
                      };

                //wannasの検索、とりあえずserchFriendsからコピー
                //検索窓からの取り込み=tipsToFind
                $scope.searchWannas = function(tipsToFind){
                    if (tipsToFind == "") {
                    //検索窓が空欄の時は検索前に戻す(全部が当てはまるという検索の時間省略のため)
                        $scope.wannas =allwanna;
                        console.log('reset');
                    }
                    else {//検索部
                        $scope.serchwannas = [];
                        console.log("searching...",tipsToFind);
                        for (var i = 0; i < allwanna.length; i++){
                            var item = allwanna[i];
                            var serchword = new RegExp(tipsToFind);
                            if ( item.content.match(serchword) || item.description.match(serchword)) {
                                $scope.serchwannas.push(item);
                                //列に検索されたものを追加
                            }
                        }

                        if ($scope.serchwannas.length !== 0){//ヒットしたとき
                            $scope.wannas = $scope.serchwannas
                            console.log('searched wannas are',$scope.wannas);
                        }
                        else if ($scope.serchwannas.length == 0){//何もヒットしなかったときは表示なし
                            $scope.wannas =　[]
                            console.log('wannas are not finded');
                        }
                    }
                };

})
