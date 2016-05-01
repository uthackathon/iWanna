'use strict'

app.controller('DashCtrl', function($scope,$state,Wannas,SharedStateService) {
                  $scope.wannas =Wannas.all()
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
