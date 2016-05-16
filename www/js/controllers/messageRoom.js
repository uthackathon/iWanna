'use strict'

app.controller('MessageRoomCtrl', function(FURL,$scope,$state,Message,SharedStateServiceForMessage,uid,Wannas, $document) {

            $scope.title = '<div class = "message-friend">{{message}}</div>';
            

				var ref = new Firebase(FURL);



				$scope.allMessages = [];

               	console.log('entered message room');
         
               	$scope.currentRoomId=SharedStateServiceForMessage.chosenRoomId;
               	console.log("ContentPage",$scope.chosenRoomId);

               	$scope.sendMessage = function(){
               		var user = Wannas.getUserName(uid);
               		console.log(Wannas.getUserName(uid));
               		
               		var message = user + " : " + $scope.data.message;
               		Message.sendMessage(message,uid,$scope.currentRoomId).then(function(){
            		$scope.data.message = "";//メッセージを消去
            		
            		});
               		
               	};

               	$scope.$on('$ionicView.enter', function(e){
                     console.log("allMessage is ",$scope.allMessages);
               		$scope.allMessages = [];
               		Message.getAllMessages($scope.currentRoomId).$loaded().then(function(data) {
					for (var i = 0; i < data.length; i++) {
						var item = data[i];
                  console.log(item);

						$scope.allMessages.push(item.message);
				
					}
					
					});

               	});
               	

               	//firebaseのデーター構造に変化があった時（つまりメッセージを送信した時）に更新
               	ref.child('rooms').child($scope.currentRoomId).child('messages').on('child_added', function(dataSnapshot) {
               		$scope.allMessages = []　//初期化。メッセージ更新のたびに初期化はまずい。。。。要訂正
               		
               		Message.getAllMessages($scope.currentRoomId).$loaded().then(function(data) {
					for (var i = 0; i < data.length; i++) {
						var item = data[i];

						$scope.allMessages.push(item.message);
				
					}
					});
 
				});
   $scope.messageBy = "message-friend";

   $scope.messageBy = function(mid){
      if(uid == mid){
         return "message-me";
      }else{
         return "message-friend";
      } 
   }
      

})
