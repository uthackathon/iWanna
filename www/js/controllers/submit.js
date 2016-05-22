'use strict'

app.controller('SubmitCtrl', function(Auth,uid, $scope,$state, Wannas,$ionicPopup,$timeout) {
               var currentUid = uid;
               var iconArray = [0,0,0,0,0];

               var icon1="icon ion-ios-football";//アイコンの画像名をwanna につけて保存
               var icon2="icon ion-ios-wineglass";
               var icon3="icon ion-bag";
               var icon4="icon ion-map";
               var icon5="icon ion-music-note";
               /*
               var icon1="img/soccer.png";//アイコンの画像名をwanna につけて保存
               var icon2="img/dinner.png";
               var icon3="img/shop.png";
               var icon4="img/map.png";
               var icon5="img/music.png";
               */
               var buttonsName=['sportButton','dinnerButton','shoppingButton','sightseeingButton','musicButton'];



               $scope.wannaSubmit=function(wanna){
               var iconNames=["img/noIcon.png"];
               var now = new Date();//日付しゅとく データ整形してない
               //date object のメソッドについては http://so-zou.jp/web-app/tech/programming/javascript/grammar/object/date.htm#no3

               //日本時間ではなく UTC で入れている。
//               console.log("year",typeof now.getUTCFullYear());

               var time = now.getUTCFullYear()*10000000000+(now.getUTCMonth()+1)*100000000+now.getUTCDate()*1000000+now.getUTCHours()*10000+now.getUTCMinutes()*100+now.getUTCSeconds();

               console.log("submit button was clicked",wanna);

//             各アイコンの画像名をiconNameに追加する。   配列のメソッドについては http://hakuhin.jp/js/array.html を参考にした
//             5つ書いたけど、当面はアイコン数は1つしか利用しないでおく
               if(iconArray[0]){
                var num = iconNames.unshift(icon1);//var num 要るのか?
               }
               if(iconArray[1]){
                var num = iconNames.unshift(icon2);//unshift は 先頭に要素を追加して、全要素数を返すメソッド。
               }
               if(iconArray[2]){
                var num = iconNames.unshift(icon3);
               }
               if(iconArray[3]){
                var num = iconNames.unshift(icon4);
               }
               if(iconArray[4]){
                var num = iconNames.unshift(icon5);
               }
               console.log("icon names",wanna);

               if(wanna.description==null){
                wanna.description="[No description]";
               }
               var flag=1;//flag でtimeoutの処理変える
               //ここでwanna をfirebase 上に記録。
               $timeout(function(){
                 console.log("timeout conducted");
                 if(flag){
                   flag=0;//本当はflag じゃなくて、getObjectUserName の中止コマンドがあればいいのだが...
                   var alertPopup = $ionicPopup.alert({
                                    title: '通信エラー',
                   });
                   $state.go('tab.dash');
                 }
               },5000);
               console.log("start getUserName");

               Wannas.getObjectUserName(currentUid).$loaded().then(function(obj){
                   var userName=obj.$value;
                   console.log("got userName");
                   if(flag){
                   flag=0;
                   console.log("start upload");
                   Wannas.saveWanna(wanna,currentUid,userName,iconNames,time);
                   $state.go('tab.dash');
                   }
              }).catch(function(error) {
                   console.error("Error:", error);
                   var alertPopup = $ionicPopup.alert({
                                    title: 'エラー',
                                    template: 'ユーザー名の取得に失敗しました。'
                   });
                 });
              };


               //sport button をデバック用に使ってます。
               $scope.wannaSport=function(){
               console.log(typeof now);
               console.log("uid is", currentUid);
               console.log("sport button was clicked");
               var target = document.getElementById(buttonsName[0]);
               if (iconArray[0]==0){
                    var pos =iconArray.indexOf(1);
                    console.log("position of 1" ,pos);
                    if(pos != -1){
                    var pretarget = document.getElementById(buttonsName[pos]);
                    pretarget.style.backgroundColor='';
                    pretarget.style.color='';
                    }
                   iconArray=[0,0,0,0,0];//当面は利用アイコンを1個に制限するため、全部をゼロに戻す。
                   target.style.backgroundColor='#27c2f1';
                   target.style.color='#ffffff';
                   iconArray[0]=1;
               }else{
                   target.style.backgroundColor='';
                   target.style.color='';
                   iconArray[0]=0;
               }
               };

               $scope.wannaDinner=function(){
               console.log("dinner button was clicked");
               var target = document.getElementById(buttonsName[1]);
               if (iconArray[1]==0){
                    var pos =iconArray.indexOf(1);
                    console.log("position of 1" ,pos);

                    if(pos != -1){
                    var pretarget = document.getElementById(buttonsName[pos]);
                    pretarget.style.backgroundColor='';
                    pretarget.style.color='';
                    }
                    iconArray=[0,0,0,0,0];//当面は利用アイコンを1個に制限するため、全部をゼロに戻す。
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
               var target = document.getElementById(buttonsName[2]);
               if (iconArray[2]==0){
                    var pos =iconArray.indexOf(1);
                    console.log("position of 1" ,pos);

                    if(pos != -1){
                    var pretarget = document.getElementById(buttonsName[pos]);
                    pretarget.style.backgroundColor='';
                    pretarget.style.color='';
                    }
                    iconArray=[0,0,0,0,0];//当面は利用アイコンを1個に制限するため、全部をゼロに戻す。

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
               var target = document.getElementById(buttonsName[3]);
               if (iconArray[3]==0){
                    var pos =iconArray.indexOf(1);
                    console.log("position of 1" ,pos);

                    if(pos != -1){
                    var pretarget = document.getElementById(buttonsName[pos]);
                    pretarget.style.backgroundColor='';
                    pretarget.style.color='';
                    }
                   iconArray=[0,0,0,0,0];//当面は利用アイコンを1個に制限するため、全部をゼロに戻す。
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
               var target = document.getElementById(buttonsName[4]);
               if (iconArray[4]==0){
                    var pos =iconArray.indexOf(1);
                    console.log("position of 1" ,pos);

                    if(pos != -1){
                    var pretarget = document.getElementById(buttonsName[pos]);
                    pretarget.style.backgroundColor='';
                    pretarget.style.color='';
                    }
                   iconArray=[0,0,0,0,0];//当面は利用アイコンを1個に制限するため、全部をゼロに戻す。
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