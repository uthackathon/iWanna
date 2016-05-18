'use strict'

app.controller('MessageRoomCtrl', function(FURL,$scope,$state,Message,SharedStateServiceForMessage,uid,Wannas,$ionicLoading){
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
                    $scope.show();
               		$scope.allMessages = [];
               		Message.getAllMessages($scope.currentRoomId).$loaded().then(function(data) {
					for (var i = 0; i < data.length; i++) {
						var item = data[i];

						$scope.allMessages.push(item.message);
				
					}
					console.log("message is",$scope.data.message);
					});
                    $scope.hide();
               	});
               	

               	//firebaseのデーター構造に変化があった時（つまりメッセージを送信した時）に更新
               	ref.child('rooms').child($scope.currentRoomId).child('messages').on('child_added', function(dataSnapshot) {
               		$scope.show();
                    $scope.allMessages = []　//初期化。メッセージ更新のたびに初期化はまずい。。。。要訂正
               		
               		Message.getAllMessages($scope.currentRoomId).$loaded().then(function(data) {
					for (var i = 0; i < data.length; i++) {
						var item = data[i];

						$scope.allMessages.push(item.message);
				
					}
				    console.log("message is",$scope.data.message );
					});
                    $scope.hide();
 
				});

              //砂時計を表示
   $scope.show = function() {
    $ionicLoading.show({
    template: '<ion-spinner icon = "bubbles"></ion-spiner>'

   });
   };

   //砂時計を非表示
   $scope.hide = function() {
   $ionicLoading.hide();
   };

})