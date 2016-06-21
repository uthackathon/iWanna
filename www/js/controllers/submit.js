'use strict'

app.controller('SubmitCtrl', function(Auth,uid, $scope,$state, Wannas,$ionicPopup,$timeout) {
               var currentUid = uid;

               var motBar=document.getElementById('motBar');
               var subBut=document.getElementById('submitButton');
               $scope.motivation=30;
               $scope.motColor=Wannas.getColor($scope.motivation);
               subBut.style.backgroundColor=$scope.motColor;
               $scope.chosenIconName=0;

               //ボタン増やしたら、以下にボタンでのicon名前とボタンのIDを対応させて追加し、イベントも追加すること。
               var iconSet1 =  ["icon ion-ios-football",
                                 "icon ion-android-restaurant",
                                 "icon ion-bag",
                                 "icon ion-map",
                                 "icon ion-music-note",
                                 "icon ion-android-film",
                                 "icon ion-ios-wineglass",
                                 "icon ion-ios-game-controller-b",
                                 "icon ion-more"
                                 ];
               var iconSet2 =  [
                                 "icon ion-beer",
                                 "icon ion-icecream",
                                 "icon ion-coffee",
                                 "icon ion-ios-basketball",
                                 "icon ion-ios-baseball",
                                 "icon ion-android-walk",
                                 "icon ion-android-bicycle",
                                 "icon ion-model-s",
                                 "icon ion-more"
                                 ];
               var iconSet3 =  [
                                 "icon ion-paintbrush",
                                 "icon ion-ios-monitor",
                                 "icon ion-bonfire",
                                 "icon ion-wrench",
                                 "icon ion-mic-b",
                                 "icon ion-university",
                                 "",
                                 "",
                                 "icon ion-more"
                                 ];
               $scope.iconNames=iconSet1;
               //各ボタンの名前と、それぞれのエレメントをtargetsという名前で保管
               var buttonsName=['b1','b2','b3','b4','b5','b6','b7','b8','b9'];
               var targets=[];
               for(var i=0;i<buttonsName.length;i++){//targetsにそれぞれのボタンのエレメントを格納
                   targets.push(document.getElementById(buttonsName[i]));
               };



            $scope.wannaSubmit=function(wanna){
               var iconNames=["ion-android-bulb"];
               var now = new Date();//日付しゅとく データ整形してない
               //date object のメソッドについては http://so-zou.jp/web-app/tech/programming/javascript/grammar/object/date.htm#no3
               //日本時間ではなく UTC で入れている。
//               var time = now.getUTCFullYear()*10000000000+(now.getUTCMonth()+1)*100000000+now.getUTCDate()*1000000+now.getUTCHours()*10000+now.getUTCMinutes()*100+now.getUTCSeconds();
               var time = now.getFullYear()*10000000000+(now.getMonth()+1)*100000000+now.getDate()*1000000+now.getHours()*10000+now.getMinutes()*100+now.getSeconds();
               console.log("submit button was clicked",wanna);

               if($scope.chosenIconName){//アイコンを選択していたら
                   var num = iconNames.unshift($scope.chosenIconName);//unshift は 先頭に要素を追加して、全要素数を返すメソッド。//var num 要るのか?
               }
               if(wanna.description==null){
                wanna.description="[No description]";
               }

               var flag=1;//flag でtimeoutの処理変える
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

               //ここでwanna をfirebase 上に記録。
               Wannas.getObjectUserName(currentUid).$loaded().then(function(obj){
                   var userName=obj.$value;
                   // console.log("got userName");
                   if(flag){
                   flag=0;//timeoutに出ないようにflagを下げる
                   // console.log("start upload");
                   Wannas.saveWanna(wanna,currentUid,userName,iconNames,time,$scope.motColor,$scope.motivation);
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

            var iconState=1;
            $scope.buttonColors=function(num){//ボタンの色変え(選択したアイコン名)の関数
                if(num==8){//moreボタンだけ特殊操作
                    if(iconState==1){
                        $scope.iconNames=iconSet2;
                        iconState=2;
                    }else if(iconState==2){
                        $scope.iconNames=iconSet3;
                        iconState=3;
                    }else if(iconState==3){
                        $scope.iconNames=iconSet1;
                        iconState=1;
                    }
                }else{
                   if ($scope.chosenIconName==$scope.iconNames[num]){//そこにすでに色が付いていたら
                       $scope.chosenIconName=0;
                   }else{//色つきなしor他のに色つきのとき
                       $scope.chosenIconName=$scope.iconNames[num];
                   }
                }
            };

            $scope.buttonStyle=function(iconName){
                if(iconName){//空白じゃないかどうか
                    if(iconName==$scope.chosenIconName){//選択したアイコンがそのアイコンと一致
                        return {'background-color':$scope.motColor,
                                'color':'#ffffff'}
                    }else{//アイコンが選択されてない、あるいは選択したアイコンと異なるとき
                        return {'background-color':'',
                                'color':''}
                    }
                }else{//アイコンのない空白
                    return {'background-color':'',
                            'color':''}
                }
            };

            $scope.changeSlider=function(motivation){
                 // console.log('slider changed');
                 $scope.motivation=motivation;
                 $scope.motColor=Wannas.getColor(motivation);
                 subBut.style.backgroundColor=$scope.motColor;
//                 var pos =$scope.iconNames.indexOf($scope.chosenIconName);
//                 if(pos != -1){
//                   targets[pos].style.backgroundColor=$scope.motColor;
//                   }
//                 motBar.style.backgroundColor=Wannas.getColor(motivation);
//                 $scope.colorfulSubmit=Wannas.getColor(motivation);
            };

});