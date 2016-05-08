'use strict'

app.factory('Message', function(FURL, $firebaseArray, $firebaseObject, Auth, Wannas) {
  var ref = new Firebase(FURL);

  var Message = {

    createNewRoom: function(uid1,uid2){
                  var rooms = $firebaseArray(ref.child('rooms'));
                  var newRoom={
                    users: [uid1,uid2]
                  };

                  return rooms.$add(newRoom).then(function(){
                    var roomId = rooms[rooms.length - 1].$id//新しく追加したroomIdを取得
                    console.log('roomId is',roomId);
                    var user1 = $firebaseArray(ref.child('users').child(uid1).child('rooms'));
                    var user2 = $firebaseArray(ref.child('users').child(uid2).child('rooms'));
                    
                    var newRoom1 = {
                      roomId: roomId,
                      friendId: uid2, 
                      friendName: Wannas.getUserName(uid2)

                    };
                    var newRoom2 = {
                      roomId: roomId,
                      friendId: uid1,
                      friendName: Wannas.getUserName(uid1)

                    };
                    user1.$add(newRoom1);
                    user2.$add(newRoom2);
                    return true;
                  });
   
    },
    getAllRooms: function(currentUid){
      return $firebaseArray(ref.child('users').child(currentUid).child('rooms'));
    },

    sendMessage: function(message,currentUid,currentRoomId){
                  var currentRoom = $firebaseArray(ref.child('rooms').child(currentRoomId).child('messages'));
                  var newMessage={
                    message: message,
                    userId: currentUid
                  };

                  return currentRoom.$add(newMessage);
    },

    getAllMessages: function(currentRoomId){
      return $firebaseArray(ref.child('rooms').child(currentRoomId).child('messages'));
    }

  }
  return Message;

});