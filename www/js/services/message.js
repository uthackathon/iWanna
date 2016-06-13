'use strict'

app.factory('Message', function(FURL, $firebaseArray, $firebaseObject, Auth, Wannas) {
  var ref = new Firebase(FURL);

  var Message = {

    createNewRoom: function(uid1,uid2){
      if(uid1 != uid2 ){
                  var rooms = $firebaseArray(ref.child('rooms'));
                  var newRoom={
                    users: [uid1,uid2]
                  };

                  Auth.getUsersRooms(uid1).$loaded().then(function(data){
                    if(_.contains(_.pluck(data,'friendId'),uid2) ){//message room を複数作らないための処理。roomsの下のfriendIdのみを取り出してリスト化する。その上で、uid2が含まれているかどうかを調べる。

                      console.log('this room is already added');

                    }
                    else{
                      return rooms.$add(newRoom).then(function(){
                        var roomId = rooms[rooms.length - 1].$id//新しく追加したroomIdを取得
                        console.log('roomId is',roomId);

                        var user1 = ref.child('users').child(uid1).child('rooms');
                        var user2 = ref.child('users').child(uid2).child('rooms');

                        var newRoom1 = {
                          roomId: roomId,
                          friendId: uid2,
                          friendName: Wannas.getUserName(uid2)

                        };


                          user1.child(roomId).set(newRoom1);
                          var newRoom2 = {
                            roomId: roomId,
                            friendId: uid1,
                            friendName: Wannas.getUserName(uid1)
                          };
                          user2.child(roomId).set(newRoom2);




                      });

                    };
                  });
                }
    },
    createNewRoomWithMessage: function(uid1,uid2,message){
      if(uid1 != uid2 ){
                  var rooms = $firebaseArray(ref.child('rooms'));
                  var newRoom={
                    users: [uid1,uid2]
                  };

                  Auth.getUsersRooms(uid1).$loaded().then(function(data){
                    if(_.contains(_.pluck(data,'friendId'),uid2) ){//message room を複数作らないための処理。roomsの下のfriendIdのみを取り出してリスト化する。その上で、uid2が含まれているかどうかを調べる。

                      console.log('this room is already added');

                    }
                    else{
                      return rooms.$add(newRoom).then(function(){
                        var roomId = rooms[rooms.length - 1].$id//新しく追加したroomIdを取得
                        console.log('roomId is',roomId);
                        var user1 = ref.child('users').child(uid1).child('rooms');
                        var user2 = ref.child('users').child(uid2).child('rooms');


                        return Wannas.getObjectUserName(uid2).$loaded().then(function(obj2){
                          var userName2=obj2.$value;
                            var newRoom1 = {
                              roomId: roomId,
                              friendId: uid2,
                              friendName: userName2,
                              lastMessage: message,
                              color: "#ff8c00" //未読の色
                            };

                            user1.child(roomId).set(newRoom1);
                              return Wannas.getObjectUserName(uid1).$loaded().then(function(obj1){
                                var userName1=obj1.$value;
                                var newRoom2 = {
                                roomId: roomId,
                                friendId: uid1,
                                friendName: userName1,
                                lastMessage: message,
                                color: "#ff8c00" //未読の色
                                };
                                user2.child(roomId).set(newRoom2);
                                  var newMessage={
                                      message: message,
                                      userId: uid1
                                      };
                                  return $firebaseArray(ref.child('rooms').child(roomId).child('messages')).$loaded().then(function(data){
                                    console.log("return currentRoom.$add(newMessage);");
                                    console.log(data);
                                    return data.$add(newMessage);
                                  });


                              });




                        });




                      });

                    };
                  });
                }
    },

    getAllRooms: function(currentUid){
      return $firebaseArray(ref.child('users').child(currentUid).child('rooms'));
    },

    sendMessage: function(message,currentUid,currentRoomId){
                  var currentRoom = ref.child('rooms').child(currentRoomId);
                  var messageRoom = $firebaseArray(currentRoom.child('messages'));

                  var newMessage={
                    message: message,
                    userId: currentUid
                  };
                  console.log('send message');

                  $firebaseArray(currentRoom.child('users')).$loaded().then(function(array){//messagegroomのユーザーId取得
                    for (var i = 0; i < array.length; i++) {
                      //console.log(array[i].$value);
                      var userchatdata = ref.child('users').child(array[i].$value).child('rooms');
                      userchatdata.child(currentRoomId).child("lastMessage").set(message);
                      userchatdata.child(currentRoomId).child("color").set("#ff8c00");//未読の色
                      console.log("new message");
                    };
                  });

                  return messageRoom.$add(newMessage);
    },

    lastMessage: function(message,currentUid,currentRoomId){
                  var currentRoom = $firebaseArray(ref.child('rooms').child(currentRoomId));
                  console.log('reset lastMessage');
                  return currentRoom.child("lastmessage").set(message);
                },




    getAllMessages: function(currentRoomId,currentUid){
      var alreadyReed = function(){
        ref.child('users').child(currentUid).child('rooms').child(currentRoomId).child("color").set("#000000");//既読の色に設定
        console.log("already read");
      };
      setTimeout(alreadyReed, 1000);
      return $firebaseArray(ref.child('rooms').child(currentRoomId).child('messages'));
    },

    removeMessages: function(currentRoomId){
        var currentRoom = ref.child('rooms').child(currentRoomId);
        $firebaseArray(currentRoom.child('users')).$loaded().then(function(array){//messagegroomのユーザーId取得
          console.log(array.length);
                    currentRoom.remove();//roomのほうの削除
                    for (var i = 0; i < array.length; i++) {
                      //console.log(array[i].$value);
                      ref.child('users').child(array[i].$value).child('rooms').child(currentRoomId).remove();//userのほうの削除
                    };
                  });
    }

  }
  return Message;

});