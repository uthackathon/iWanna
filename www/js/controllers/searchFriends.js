'use strict'

app.controller('SearchFriendsCtrl', function($firebaseAuth, Follow, Match, Auth, uid, $scope) {
	
	// var searchFriends = this
    var currentUid = uid
    $scope.currentIndex = null;
    $scope.currentCardUid = null;

    $scope.profiles = [];

	$scope.searchFriendsByName = function(index,friendNameToFind){
		//まずは検索窓の初期化		
		$scope.cardRemove(index);	

	  	Auth.getProfiles().$loaded().then(function(data){
			for (var i = 0; i < data.length; i++){

				var item = data[i];
				if(item.name == friendNameToFind && item.$id != currentUid){
					//nameが一致かつ、自分自信ではない時
					$scope.profiles.push(item);
				}

				if ($scope.profiles.length > 0){
					//indexの変更
					$scope.currentIndex = $scope.profiles.length - 1;
					$scope.currentCardUid = $scope.profiles[$scope.currentIndex].$id;
				}

			}
		});
	
	},

  	$scope.follow = function(index, follow_uid) {
  		Follow.addFollow(currentUid, follow_uid);
  		Match.checkMatch(currentUid, follow_uid);
  		$scope.cardRemove(index);

  		console.log("FOLLOW")
  	},

  	$scope.cardRemove = function(index) {
		$scope.profiles.splice(index, 1);

		if($scope.profiles.length > 0){
			//現在のindexの
			$scope.currentIndex = $scope.profiles.length - 1;
			$scope.currentCardUid = $scope.profiles[$scope.currentIndex].$id;
		}
 	}

});
