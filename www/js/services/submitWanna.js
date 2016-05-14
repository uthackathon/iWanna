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


       saveWanna: function(wanna,currentUid,userName,iconArray,time){
                  var wannas = $firebaseArray(ref.child('users').child(currentUid).child('wannas'));//firebase構造によって変えてみてください。
                  var newWanna={
                    ownerId: currentUid,
                    user_name: userName,//名前取得できるように
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



                addLikeToWanna: function(wannaOwnerId,wannaId,currentUid){
                  console.log("wannaOwnerId",wannaOwnerId);
                  console.log("wannaId",wannaId);
                  console.log("currentUid",currentUid);
                  var likesInWanna = $firebaseArray(ref.child('users').child(wannaOwnerId).child('wannas').child(wannaId).child("likes"));//firebase構造によって変えてみてください。
                  return likesInWanna.$add(currentUid).then(function(){
                                      console.log('like added to the wanna-database');})
                },

                addLikeToUser: function(wannaOwnerId,wannaId,currentUid){
                  console.log("wannaOwnerId",wannaOwnerId);
                  console.log("wannaId",wannaId);
                  console.log("currentUid",currentUid);
                  var likesInUser = $firebaseArray(ref.child('users').child(currentUid).child('likes'));//firebase構造によって変えてみてください。
                  var wannaPath= wannaOwnerId+"/"+wannaId;
                  return likesInUser.$add(wannaPath).then(function(){
                                      console.log('like added to the user-database');})
                },


                removeLike:function(wannaOwnerId,wannaId,currentUid){
                                             console.log("wannaOwnerId",wannaOwnerId);
                                             console.log("wannaId",wannaId);
                                             console.log("currentUid",currentUid);
                                             var UserDataInWanna = $firebaseArray(ref.child('users').child(wannaOwnerId).child('wannas').child(wannaId).child("likes").key(currentUid));//firebase構造によって変えてみてください。
                                             var WannaDataInUser = $firebaseArray(ref.child('users').child(currentUid).child('likes').key(wannaId));//firebase構造によって変えてみてください。
                                             var wannaPath= wannaOwnerId+"/"+wannaId;

                                             UserDataInWanna.remove().then(function(){
                                                                 console.log('like removed in the wanna-database');})
                                             WannaDataInUser.remove().then(function(){
                                                                 console.log('like removed in the user-database');})


                },

                findUsersLikes:function(data,currentUid){
                 var likedWannaId=[];
                 for (var i = 0; i < data.length; i++){
                   var item = data[i];
                   var likeUsers =[];
                   for(var key in item.likes){
                    likeUsers.push(item.likes[key]);
                   }
                   var pos=likeUsers.indexOf(currentUid);
                   if(pos!=-1){//自分のid がlikes の中にあるとき
                     likedWannaId.push(item.$id);//その wanna のid を保管。
                    // console.log("find like",item.$id);
                   }
                   };
//                   $scope.wannas=data;//表示するやつをdata に同期
                   console.log("users likes",likedWannaId);
                   return likedWannaId;
                 },



              };
              return Wannas;
})
