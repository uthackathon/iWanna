'use strict'

app.controller('MakeWannaGroupCtrl', function($scope, Auth, $state, uid,Wannas,SharedStateService){
  $scope.friendImages ={'initUid':'initImg'};
  $scope.currentUid=uid;
  $scope.accountInformation = Auth.getProfile(uid);//めっちゃおもいので、UserNameだけ取得にしました。
	//$scope.accountName = Wannas.getUserName(uid);//UserNameだけ取得にしました。
  Wannas.all(uid).$loaded().then(function(data){
    $scope.allWannasList=data;
    $scope.allWannasList.reverse();
    $scope.showingWannasList=$scope.allWannasList;
  });
  var chosenWanna=0;

  $scope.isChosen=function(wanna){
    if(wanna==chosenWanna){
        return {'background-color':'#f8f8f8'}
    }else{
      return
    }
  };


  $scope.completeToggle=function(complete){//コンプリートマークの有無を返す
    if(complete){
        return {'display':'block'}
    }else{
        return {'display':'none'}
    }
  };

  $scope.goContentPage=function(wanna){
    $state.go('tab.wannaGroup-content');
    SharedStateService.groupWanna=wanna;
  };

  $scope.chooseWanna=function(wanna){
    if(chosenWanna==0){
      chosenWanna=wanna;
    }else{
      chosenWanna=0;
    }

  };

})