'use strict';

app.controller('FriendsCtrl', function(Match, Auth, uid, $scope, Follow){
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
		console.log("the list is",$scope.list);
	});
	
	
})