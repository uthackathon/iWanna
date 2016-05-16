'use strict'

app.controller('AccountCtrl', function(FURL, $scope,  Auth, uid){

		$scope.$on('$ionicView.enter', function(e){
			
	
			$scope.accountInformation = Auth.getProfile(uid);
			
		});

	 	$scope.logout = function(){
	 			console.log("logout was clicked");
	   		Auth.logout().then(function() {	
				// $ionicHistory.clearCache();
    //   			$ionicHistory.clearHistory();
      			console.log("logout then clear");
			});
 		}
 		

})