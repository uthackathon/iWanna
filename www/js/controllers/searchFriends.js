//underscorejsを使用していることに注意のこと（http://underscorejs.org/）

'use strict'

app.controller('SearchFriendsCtrl', function($firebaseAuth, $ionicLoading, $ionicModal,Follow, Followed, Match, Auth, uid, $scope) {
	
    var currentUid = uid

    $scope.currentIndex = null;
    $scope.currentCardUid = null;
    $scope.profiles = [];

    $scope.currentRecommendedIndex = null;
    $scope.currentRecommendedCardUid = null;
    $scope.recommendedUsers = [];

	$scope.searchFriendsByName = function(index,friendNameToFind){
		//まずは検索窓の初期化		
		$scope.cardRemove(index);	

	  	Auth.getProfiles().$loaded().then(function(data){
			for (var i = 0; i < data.length; i++){

				var item = data[i];
				if(item.name == friendNameToFind && item.$id != currentUid){
					//nameが一致かつ、自分自身ではない時
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

	// //以下のように書くことにより、ページ遷移した時に呼び出せるらしい(要調査)が、ページを更新するたびにリストに追加されてしまうのでやめた。
	//しかしながら、使用時に友達申請されたらどうなるかよく分からない。初めてログインした時から友達リストが変わらない????
	// $scope.$on('$ionicView.enter', function(e){

	//$loded().thenは読み込みに時間がかかる関数を呼び出す時に必須。thenの中のfunctionには呼び出し終わった関数のretunが入る。
	Followed.allFollowedsByUser(currentUid).$loaded().then(function(followedList) {
		for (var i = 0; i < followedList.length; i++){
		var id = followedList[i].$id;
		var user = Auth.getProfile(id);
		$scope.recommendedUsers.push(user);
			}
		});
	Follow.allFollowsByUser(currentUid).$loaded().then(function(followList) {
		//undescorejsを使用。ここでは上で一度求めたrecommendUsersのidとfollowlistのidを比較し、idが一致しているものを要素から取り除くというアルゴリズムをなんと２行で実現している。
		$scope.recommendedUsers = _.filter($scope.recommendedUsers, function(obj){
			return _.isEmpty(_.where(followList, {$id: obj.$id}));
		});
	});
	// });	
	

  	$scope.follow = function(index, follow_uid) {
  		Follow.addFollow(currentUid, follow_uid);
  		Followed.addFollowed(follow_uid, currentUid);
  		Match.checkMatch(currentUid, follow_uid);
  		$scope.cardRemove(index);

  		console.log("FOLLOW")
  	},

  	$scope.followRecommended = function(index, follow_uid) {
  		Follow.addFollow(currentUid, follow_uid);
  		Followed.addFollowed(follow_uid, currentUid);
  		Match.checkMatch(currentUid, follow_uid);
  		$scope.recommendedCardRemove(index);

  		console.log("FOLLOW RECOMMENDED")
  	},

  	$scope.cardRemove = function(index) {
		$scope.profiles.splice(index, 1);

		if($scope.profiles.length > 0){
			//現在のindexの
			$scope.currentIndex = $scope.profiles.length - 1;
			$scope.currentCardUid = $scope.profiles[$scope.currentIndex].$id;
		}
 	}

 	$scope.recommendedCardRemove = function(index) {
		$scope.recommendedUsers.splice(index, 1);

		if($scope.recommendedUsers.length > 0){
			//現在のindexの
			$scope.currentRecommendedIndex = $scope.recommendedUsers.length - 1;
			$scope.currentRecommendedCardUid = $scope.profiles[$scope.currentRecommendedIndex].$id;
		}
 	}

});