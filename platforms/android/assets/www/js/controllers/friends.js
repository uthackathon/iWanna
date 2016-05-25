'use strict';

app.controller('FriendsCtrl', function(Match, Auth, uid, $scope,$state, Follow, Message, $ionicActionSheet,$ionicPopup){
    var searchFriends = this
    var currentUid = uid

	$scope.allFriendslist = [];

	Match.allMatchesByUser(uid).$loaded().then(function(data) {
		for (var i = 0; i < data.length; i++) {
				var item = data[i];

				Auth.getProfile(item.$id).$loaded().then(function(profile) {
					$scope.allFriendslist.push(profile);
				});
		}
	});

	// ボタンが押された時、選択肢がPopupする
 	$scope.showFunctionList = function(friend_uid) {
 		console.log(friend_uid);
    
    $ionicActionSheet.show({
		titleText: 'Friends name',
		buttons: [
		{ text: '<i class="icon ion-ios-email calm"></i> Send Message'},
		{ text: '<i class="icon ion-clipboard calm"></i> Profile' }
		],
		destructiveText: '<i class="icon ion-trash-a assertive"></i> Delete',
		cancelText: 'Cancel',
		cancel: function() {
		console.log('CANCELLED');
		},
		buttonClicked: function(index) {
     		if (index == 0){
     			Message.createNewRoom(uid,friend_uid);
     			$state.go('tab.messages');

     			console.log('SEND MESSAGE CLICKED', index);
     		}

        	return true;
        },

        destructiveButtonClicked: function() {
         	console.log('DESTRUCT');
         	$scope.showConfirm();
        	return true;
      	}
    });

    $scope.showConfirm = function() {
   	var confirmPopup = $ionicPopup.confirm({
    title: '友達の消去',
    template: 'Are you sure you want to delete this user?'
   	});

   	confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
   });
 };
  };

})