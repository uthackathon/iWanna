'use strict'

app.controller('SubmitCtrl', function($scope,$state, Wannas) {

               var Array = [0,0,0,0,0];

               $scope.wannaSubmit=function(wanna){

               console.log("submit button was clicked",wanna);
               Wannas.saveWanna(wanna);
               $state.go('tab.dash');//state.goディレクトリ関係がわからない
               };

               $scope.wannaSport=function(){
               console.log("sport button was clicked");
               var target = document.getElementById('sportButton');
               if (Array[0]==0){
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               Array[0]=1;
               }else{
               target.style.backgroundColor='';
               target.style.color='';
               Array[0]=0;
               }
               //状態を表すもの (1,0) などで色を戻したりできそう。

               };

               $scope.wannaDinner=function(){
               console.log("dinner button was clicked");
               var target = document.getElementById('dinnerButton');
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               if (Array[1]==0){
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               Array[1]=1;
               }else{
               target.style.backgroundColor='';
               target.style.color='';
               Array[1]=0;
               }
               };

               $scope.wannaShopping=function(){
               console.log("Shopping button was clicked");
               var target = document.getElementById('shoppingButton');
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               if (Array[2]==0){
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               Array[2]=1;
               }else{
               target.style.backgroundColor='';
               target.style.color='';
               Array[2]=0;
               }
               };

               $scope.wannaSightseeing=function(){
               console.log("Sightseeing button was clicked");
               var target = document.getElementById('sightseeingButton');
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               if (Array[3]==0){
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               Array[3]=1;
               }else{
               target.style.backgroundColor='';
               target.style.color='';
               Array[3]=0;
               }
               };

               $scope.wannaMusic=function(){
               console.log("Music button was clicked");
               var target = document.getElementById('musicButton');
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               if (Array[4]==0){
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               Array[4]=1;
               }else{
               target.style.backgroundColor='';
               target.style.color='';
               Array[4]=0;
               }
               };

});
