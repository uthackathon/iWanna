'use strict'

app.controller('DashCtrl', function(uid,$scope,$state,Wannas,SharedStateService) {
               //ログインする前に uid を参照しようとするとエラーとなるので注意。
               //エラー処理については http://uhyohyo.net/javascript/9_8.html
               //ログインする前にuid は使えないので、エラー処理を入れた。(結局、抜いた)

               var currentUid = uid;
               //$scope.serchwannas = [];
               $scope.wannas =Wannas.all(currentUid);
               $scope.allwanna = Wannas.all(currentUid);

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

               $scope.likeWanna=function(wanna){
                      console.log("like button was clicked");
                      wanna.ownerId=currentUid;//test用の緊急処理。wanna 全てにownerId を書き込んでこの行を消すべし
                      Wannas.addLike(wanna.ownerId,wanna.$id,currentUid);
                      };

                //wannasの検索、とりあえずserchFriendsからコピー
                //検索窓からの取り込み=tipsToFind
                $scope.searchWannas = function(tipsToFind){
                    console.log("searching...",tipsToFind);

                    //該当するオブジェクトを全て返す
                    $scope.serchwannas = _.where($scope.allwanna, {content: tipsToFind});
                    if ($scope.serchwannas.length !== 0){
                        $scope.wannas = $scope.serchwannas
                        console.log('searched wannas are',$scope.wannas);
                    }
                    else if ($scope.serchwannas.length == 0){//何もヒットしなかったときはすべて表示
                        $scope.wannas =Wannas.all(currentUid);
                        console.log('wannas are not finded');
                    }
                    if (tipsToFind == "") {
                    //検索窓が空欄の時は検索前に戻す(tipsToFindが空白の時はserchwannasが定義されないようなので作成)
                        $scope.wannas =Wannas.all(currentUid);
                        console.log('reset');
                    }
                };


})
//
//'use strict'
//
//app.controller('DashCtrl', function($scope,$state,Wannas,SharedStateService) {
//                  $scope.wannas =Wannas.all("aca73453-3cbd-4213-b1bc-b561d82a173e")
//                  console.log('the products',$scope.products);
//
//
//               $scope.writeWanna=function(){
//               console.log("write button was clicked");
//               $state.go('tab.submit');//state.goディレクトリ関係がわからない
//               };
//
//               $scope.goContentPage=function(wanna){
//               console.log("goContent button was clicked");
//               $state.go('tab.wanna-content');
//               //ダッシュページと内容ページでWanna 情報をやりとりするためにSharedStateService に入れた値を共有する。
//               // http://whiskers.nukos.kitchen/2015/05/21/angularjs-controller-coordination.html のShared Service などを参考にした。
//               SharedStateService.clickedWanna=wanna;
//               $scope.clickedWanna=wanna;
//               console.log("timeline",wanna.content);
//               };
//
//})
