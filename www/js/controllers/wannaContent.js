'use strict'

app.controller('WannaContentCtrl', function($scope,$state,SharedStateService) {
               console.log('entered content page');
               //タイムラインでクリックしたwanna 情報の読み取り(Shared Service 経由で)
               $scope.clickedWanna=SharedStateService.clickedWanna;
               console.log("ContentPage",$scope.clickedWanna.content);

               $scope.likeNum=Object.keys($scope.clickedWanna.likes).length -1 ;//イニシャライズの分を1つ引く
               console.log("the number of likes",$scope.likeNum);
<<<<<<< HEAD
=======

               $scope.date = function(dayInt){
                  var dayString = String(dayInt);
                  var month = Number(dayString.substr(4,2));
                  var day = Number(dayString.substr(6,2));
                  var hour = Number(dayString.substr(8,2));
                  var min = Number(dayString.substr(10,2));
                  var date = month+"月"+day+"日 "+hour+"時"+min+"分";
                  return date;
                }

                $scope.likeWanna=function(wanna){
                    console.log("like button was clicked");
                     // wanna.ownerId=currentUid;//test用の緊急処理。wanna 全てにownerId を書き込んでこの行を消すべし
                     //<ion-spinner icon="lines" class="spinner-calm"></ion-spinner>
                    if(likeValid){//likeValid が1のときだけ、like ボタンが有効
                        var likeButton = document.getElementById(wanna.$id);
                        var buttonColor=likeButton.style.color;
                        console.log("button color",buttonColor);
                        if(buttonColor){//likeボタンがすでに色つきの時(like してるとき)
                            console.log("colorful");
                            Wannas.removeLikeFromWanna(wanna.ownerId,wanna.$id,currentUid,likeButton);
                            Wannas.removeLikeFromUser(wanna.ownerId,wanna.$id,currentUid,likeButton);
                        }else{//likeにまだ色がついてない時(like してないとき)
                            Wannas.addLikeToWanna(wanna.ownerId,wanna.$id,currentUid,likeButton);
                            Wannas.addLikeToUser(wanna.ownerId,wanna.$id,currentUid,likeButton);
                        }
                    }else{
                        console.log("like button is not valid");
                    };

               };


>>>>>>> master
})
