'use strict'

app.controller('SubmitCtrl', function(Auth,uid, $scope,$state, Wannas) {
               var currentUid = uid;
               var iconArray = [0,0,0,0,0];
               var userName= Wannas.getUserName(currentUid);


               $scope.wannaSubmit=function(wanna){
               console.log("user name is",userName);

               var now = new Date();//日付しゅとく データ整形してない
               //date object のメソッドについては http://so-zou.jp/web-app/tech/programming/javascript/grammar/object/date.htm#no3

               //日本時間ではなく UTC で入れている。
               var time={
                 year: now.getUTCFullYear(),
                 month: now.getUTCMonth()+1,//月は0から11まで
                 date: now.getUTCDate(),
                 hours: now.getUTCHours(),
                 minutes: now.getUTCMinutes(),
                 seconds: now.getUTCSeconds(),
               };
               console.log("time data");
               console.log("year",time.year);
               console.log("month",time.month);
               console.log("date",time.date);
               console.log("hours",time.hours);
               console.log("minutes",time.minutes);
               console.log("seconds",time.seconds);

               console.log("submit button was clicked",wanna);
               //ここでwanna をfirebase 上に記録。
               Wannas.saveWanna(wanna,currentUid,userName,iconArray,time);
               $state.go('tab.dash');
               };


               //sport button をデバック用に使ってます。
               $scope.wannaSport=function(){
               console.log(typeof now);


               console.log("uid is", currentUid);
               console.log("sport button was clicked");

               var target = document.getElementById('sportButton');
               if (iconArray[0]==0){
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               iconArray[0]=1;
               }else{
               target.style.backgroundColor='';
               target.style.color='';
               iconArray[0]=0;
               }
               //状態を表すもの (1,0) などで色を戻したりできそう。

               };

               $scope.wannaDinner=function(){
               console.log("dinner button was clicked");
               var target = document.getElementById('dinnerButton');
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               if (iconArray[1]==0){
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               iconArray[1]=1;
               }else{
               target.style.backgroundColor='';
               target.style.color='';
               iconArray[1]=0;
               }
               };

               $scope.wannaShopping=function(){
               console.log("Shopping button was clicked");
               var target = document.getElementById('shoppingButton');
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               if (iconArray[2]==0){
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               iconArray[2]=1;
               }else{
               target.style.backgroundColor='';
               target.style.color='';
               iconArray[2]=0;
               }
               };

               $scope.wannaSightseeing=function(){
               console.log("Sightseeing button was clicked");
               var target = document.getElementById('sightseeingButton');
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               if (iconArray[3]==0){
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               iconArray[3]=1;
               }else{
               target.style.backgroundColor='';
               target.style.color='';
               iconArray[3]=0;
               }
               };

               $scope.wannaMusic=function(){
               console.log("Music button was clicked");
               var target = document.getElementById('musicButton');
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               if (iconArray[4]==0){
               target.style.backgroundColor='#27c2f1';
               target.style.color='#ffffff';
               iconArray[4]=1;
               }else{
               target.style.backgroundColor='';
               target.style.color='';
               iconArray[4]=0;
               }
               };

});
