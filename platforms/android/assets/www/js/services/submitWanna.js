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
                  var name = "error";//wanna の名前が error のときは名前取得に失敗してる...
                  ref.child('users').child(currentUid).child('name').on("value", function(snapshot) {
                      name = snapshot.val();
                    //console.log(name);
                  }, function (err) {
                    console.log(err.code);
                  });//http://hacknote.jp/archives/9945/ を参考に。
                   return name;
                },


                saveWanna: function(wanna,currentUid,userName,iconArray,time){
                  var wannas = $firebaseArray(ref.child('users').child(currentUid).child('wannas'));//firebase構造によって変えてみてください。
                  console.log(typeof now);
                  var newWanna={
                    user_name: userName,//名前取得できるように
                    content: wanna.content,
                    description: wanna.description,
                    icon: iconArray,//アイコン取得できるように
                    upload_time: time,

                  };

                  return wannas.$add(newWanna).then(function(){
                    console.log('added to the database');

                  })
                },



                addLike: function(wannaOwnerId,wannaId,currentUid){
                  console.log("wannaOwnerId",wannaOwnerId);
                  console.log("wannaId",wannaId);
                  console.log("currentUid",currentUid);

                  var likesInWanna = $firebaseArray(ref.child('users').child(wannaOwnerId).child('wannas').child(wannaId).child("likes"));//firebase構造によって変えてみてください。

//                  var likesInWanna = ref.child('users').child(wannaOwnerId).child('wannas').child(wannaId).child("likes");//firebase構造によって変えてみてください。

                  var likesInUser = $firebaseArray(ref.child('users').child(currentUid).child('likes'));//firebase構造によって変えてみてください。
                  var wannaPth= wannaOwnerId+"/"+wannaId;

                  likesInWanna.$add(currentUid).then(function(){
                                      console.log('like added to the wanna-database');}).then(function(){console.log('like added to the wanna-database');})

//                  likesInWanna.update({currentUid})
                  likesInUser.$add(wannaPth).then(function(){
                                      console.log('like added to the user-database');})



                },

//                deleteLike:function(wannaOwnerId,wannaId,currentUid){
//                                             console.log("wannaOwnerId",wannaOwnerId);
//                                             console.log("wannaId",wannaId);
//                                             console.log("currentUid",currentUid);
//                                             var likesInWanna = $firebaseArray(ref.child('users').child(wannaOwnerId).child('wannas').child(wannaId).child("likes"));//firebase構造によって変えてみてください。
//                                             var likesInUser = $firebaseArray(ref.child('users').child(currentUid).child('likes'));//firebase構造によって変えてみてください。
//                                             var wannaPth= wannaOwnerId+"/"+wannaId;
//
//                                             likesInWanna.$add(currentUid).then(function(){
//                                                                 console.log('like added to the wanna-database');})
//                                             likesInUser.$add(wannaPth).then(function(){
//                                                                 console.log('like added to the user-database');})
//
//
//                                           },


              };
              return Wannas;
})
