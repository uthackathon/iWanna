'use strict'

app.controller('WannaContentCtrl', function($scope,$state,SharedStateService) {
               console.log('entered content page');
               //タイムラインでクリックしたwanna 情報の読み取り(Shared Service 経由で)
               $scope.clickedWanna=SharedStateService.clickedWanna;
               console.log("ContentPage",$scope.clickedWanna.content);

})
