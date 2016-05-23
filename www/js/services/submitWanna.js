'use strict'

app.factory('Wannas', function(FURL,$firebaseObject, $firebaseArray) {

              var ref =new Firebase(FURL);
//              var wannas = $firebaseArray(ref.child('facebookuser').child('wannas'));//firebase構造によって変えてみてください。

              var Wannas ={

                all: function(currentUid){
                  var wannas = $firebaseArray(ref.child('users').child(currentUid).child('wannas'));//firebase構造によって変えてみてください。
                  return wannas;
                },

                getUserName: function(currentUid){
                //なまえの取得。もし名前変更に対応するならば add とかを使うかも。
                  //var name = "error";//wanna の名前が error のときは名前取得に失敗してる...
                  ref.child('users').child(currentUid).child('name').on("value", function(snapshot) {
                      name = snapshot.val();
                    //console.log(name);
                  }, function (err) {
                    console.log(err.code);
                  });//http://hacknote.jp/archives/9945/ を参考に。
                   return name;
                },

                getObjectUserName: function(currentUid){
                  var obj =$firebaseObject(ref.child('users').child(currentUid).child('name'));
                  return obj;
                },



       saveWanna: function(wanna,currentUid,userName,iconArray,time){
                  var wannas = $firebaseArray(ref.child('users').child(currentUid).child('wannas'));//firebase構造によって変えてみてください。
                  var newWanna={
                    ownerId: currentUid,
                    user_name: userName,//名前取得できるように
                    uid: currentUid,
                    content: wanna.content,
                    description: wanna.description,
                    icon: iconArray,//アイコン取得できるように
                    upload_time: time,
                    likes: {"initializeKey": "init"},
                  };
                  return wannas.$add(newWanna).then(function(){
                    console.log('added to the database');

                  })
                },



                addLikeToWanna: function(wannaOwnerId,wannaId,currentUid,likeButton){
                  var onComplete = function(error){
                    if (error){
                        console.log('[FAILED] like to the wanna-database');
                        return 0;
                    } else {
                        console.log('like added to the wanna-database');
                        return 1;
                    }
                  };
                  ref.child('users').child(wannaOwnerId).child('wannas').child(wannaId).child("likes").child(currentUid).set(true,onComplete);
                },

                addLikeToUser: function(wannaOwnerId,wannaId,currentUid,likeButton){
                  var onComplete = function(error){//callback をtimeline.js に入れるのが上手くいかなかった(.then のpromise 設定が面倒)ので、ここに入れた
                                      if (error){
                                          console.log('[FAILED] like to the user-database');
                                          return 0;
                                      } else {
                                          console.log('like added to the user-database');
                                                likeButton.style.backgroundColor='#FFFFFF';
                                                likeButton.style.color='#FFC0CB';
                                          return 1;
                                      }
                                    };
                  var wannaPath= wannaOwnerId+"/"+wannaId;
                  ref.child('users').child(currentUid).child('likes').child(wannaPath).set(true,onComplete);
                },

                removeLikeFromWanna: function(wannaOwnerId,wannaId,currentUid,likeButton){
                  var onComplete = function(error){//callback をtimeline.js に入れるのが上手くいかなかった(.then のpromise 設定が面倒)ので、ここに入れた
                                      if (error){
                                          console.log('[FAILED] remove from the wanna-database');
                                          return 0;
                                      } else {
                                          console.log('like was removed from the wanna-database');
                                          return 1;
                                      }
                                    };
                  ref.child('users').child(wannaOwnerId).child('wannas').child(wannaId).child("likes").child(currentUid).remove(onComplete);
                },

                removeLikeFromUser: function(wannaOwnerId,wannaId,currentUid,likeButton){
                  var onComplete = function(error){//callback をtimeline.js に入れるのが上手くいかなかった(.then のpromise 設定が面倒)ので、ここに入れた
                                      if (error){
                                          console.log('[FAILED] remove from the user-database');
                                          return 0;
                                      } else {
                                          console.log('like was removed from the user-database');
                                                likeButton.style.backgroundColor='#FFFFFF';
                                                likeButton.style.color='';
                                          return 1;
                                      }
                                    };
                  var wannaPath= wannaOwnerId+"/"+wannaId;
                  ref.child('users').child(currentUid).child('likes').child(wannaPath).remove(onComplete);
                },



                findUsersLikes:function(wannas,currentUid){
                 var likedWannaId=[];
                 for (var i = 0; i < wannas.length; i++){
                   var item = wannas[i];
                   if(currentUid in item.likes){
                    likedWannaId.push(item.$id);//その wanna のid を保管。
                   };
                 };
//                   $scope.wannas=data;//表示するやつをdata に同期
                   console.log("users likes",likedWannaId);
                   return likedWannaId;
                 },

                 getColor:function(mot){//0 から100 の数字でカラーを返す
//                   var colormap = require('colormap');
//                   options = {
//                     colormap: 'jet',   // pick a builtin colormap or add your own
//                     nshades: 100,       // how many divisions
//                     format: 'hex',     // "hex" or "rgb" or "rgbaString"
//                     alpha: 1      // set an alpha value or a linear alpha mapping [start, end]
//                   }
//                   var cg = colormap(options);
//                   console.log('cg',cg);
                   //calm =~ '#27c2f1'
                   console.log('typeof mot',typeof mot);
                   var num=Number(mot);
                   if(num<210){
                       var red=39;
                       var green=32+num;
                       var blue=241;
                   }else if(num<412 && num>=210){
                       var red=39;
                       var green=242;
                       var blue=241-(num-210);
                   }else if(num<616 && num>=412){
                       var red=39+num-412;
                       var green=242;
                       var blue=39;
                   }else if(num<=700 && num>=616){
                       var red=243;
                       var green=242-(num-616);
                       var blue=39;
                   }
                   console.log('rgb',red,green,blue);
                   var colorMap='#'+red.toString(16)+green.toString(16)+blue.toString(16);
                   console.log('colorMap',colorMap);
                   return colorMap;
                 },



              };
              return Wannas;
})
