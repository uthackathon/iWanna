'use strict'

app.controller('WannaGroupContentCtrl', function(uid,$scope,$state,SharedStateService,Wannas,Message,$ionicActionSheet,$ionicPopup,Report) {
               console.log('entered content page');
               //タイムラインでクリックしたwanna 情報の読み取り(Shared Service 経由で)
               $scope.clickedWanna=SharedStateService.groupWanna;
               var likedUsersId=$scope.clickedWanna.likes;
               var idArray=[];
               var roomList = [];
               var friendNumFlag=5;//likeした人の初期表示数。
               for(var key in likedUsersId){
                   console.log('liked User',key);
                   idArray.push({'$id':key});
               };
               idArray.pop();//initial valueの消去。popの返り値は削除した値になるので注意。idArrayは一つ削られた配列に変化する。

               if(idArray.length<friendNumFlag){//制限個数より少ない時
                 friendNumFlag=idArray.length;//制限個数を配列個数に縮小
               }
               $scope.likedUsers=idArray.slice(0,friendNumFlag);//表示個数制限

               $scope.unknownImages={};
               console.log("ContentPage",$scope.clickedWanna.content);
               $scope.friendImages ={'initUid':'initImg'};
               var currentUid=uid;
               $scope.$watch(function(){
                     return SharedStateService.friendImages;
                   }, function(){
                     $scope.friendImages = SharedStateService.friendImages;
               });
               $scope.likeNum=Object.keys($scope.clickedWanna.likes).length -1 ;//イニシャライズの分を1つ引く
               console.log("the number of likes",$scope.likeNum);

               $scope.$watch('clickedWanna',function(){
                if(currentUid in $scope.clickedWanna.likes){
                    var likeButton = document.getElementById('likeInContent');
                    likeButton.style.backgroundColor='#FFFFFF';
                    likeButton.style.color='#FFC0CB';
                }
               });


               $scope.moreFriend=function(){
                        friendNumFlag =friendNumFlag+10;//さらに表示する個数をたす。
                        if(friendNumFlag>idArray.length){
                            friendNumFlag=idArray.length;
                            document.getElementById('moreLikeButton').style.display="none";
                        }
                        $scope.likedUsers=idArray.slice(0,friendNumFlag);//表示個数制限
               };

               $scope.getName=function(user){
                    console.log('get name fired');
                    Wannas.getObjectUserName(user.$id).$loaded().then(function(obj){
                      user['name'] = obj.$value;
                    });
                      if(user.id in $scope.unknownImages){
                      console.log('already gotten recommend');
                      }else{
                      $scope.unknownImages[user.$id]='img/loading.png';
                      Wannas.imageAll(user.$id).$loaded().then(function(images){
                          console.log('got new image');
                          if(images[0]==null){console.log('undefined');
                              $scope.unknownImages[user.$id]='img/iw_gray.png';
                          }else{
                              $scope.unknownImages[user.$id]=images[0]['images'];
                          }
                      },function(error){
                      console.log('oh no! no images file');
                      });
                      }
               };

               $scope.showLikedUsers=function(){
                 if(document.getElementById('likeBoard').style.display=='none'){
                     console.log('show liked users');
                     document.getElementById('likeBoard').style.display='block';
                     console.log('idArray',idArray.length);
                     console.log('friendNum',friendNumFlag);
                     if(idArray.length>friendNumFlag){//制限個数より多い
                         document.getElementById('moreLikeButton').style.display="block";
                     }//moreButtonでやってたら、friendHomeのボタンと名前がかぶってこちらのボタンの反応がなくなった。(stateは移動前のタブとのボタンIDなどが被らないように注意)
                 }else{
                     document.getElementById('likeBoard').style.display='none';
                     document.getElementById('moreLikeButton').style.display="none";
                 }
               }

               $scope.date = function(dayInt){
                  var dayString = String(dayInt);
                  var month = Number(dayString.substr(4,2));
                  var day = Number(dayString.substr(6,2));
                  var hour = Number(dayString.substr(8,2));
                  var min = Number(dayString.substr(10,2));
                  var date = month+"月"+day+"日 "+hour+"時"+min+"分";
                  return date;
                }


               $scope.goMakeGroup= function(){
                 $state.go('tab.make-group');
               };
})
