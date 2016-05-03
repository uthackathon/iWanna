//'use strict'
//
//app.controller('DashCtrl', function(uid,$scope,$state,Wannas,SharedStateService) {
//
//               //ログインする前に uid を参照しようとするとエラーとなるので注意。
//               //エラー処理については http://uhyohyo.net/javascript/9_8.html
//               //ログインする前にuid は使えないので、エラー処理を入れた。
//               try{
//               var currentUid = uid;
//               $scope.wannas =Wannas.all(currentUid);
//               $scope.writeWanna=function(){
//               console.log("write button was clicked");
//               $state.go('tab.submit');//state.goディレクトリ関係がわからない
//               };
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
//               }catch(e){
//               console.log(e);
//               $scope.wannas =Wannas.all("aca73453-3cbd-4213-b1bc-b561d82a173e");//サンプル表示
//               $scope.writeWanna=function(){
//               console.log("write button was clicked");
//               $state.go('tab.submit');//state.goディレクトリ関係がわからない
//               };
//               $scope.goContentPage=function(wanna){
//               console.log("goContent button was clicked");
//               $state.go('tab.wanna-content');
//               //ダッシュページと内容ページでWanna 情報をやりとりするためにSharedStateService に入れた値を共有する。
//               // http://whiskers.nukos.kitchen/2015/05/21/angularjs-controller-coordination.html のShared Service などを参考にした。
//               SharedStateService.clickedWanna=wanna;
//               $scope.clickedWanna=wanna;
//               console.log("timeline",wanna.content);
//
//               }
//               }
//
//
//})

'use strict'

app.controller('DashCtrl', function($scope,$state,Wannas,SharedStateService) {
                  $scope.wannas =Wannas.all("aca73453-3cbd-4213-b1bc-b561d82a173e")
                  console.log('the products',$scope.products);


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

})
