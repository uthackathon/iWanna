'use strict'

app.controller('LoginCtrl', function($scope, $state, $firebaseAuth, $ionicPopup, Auth,Loading,FURL,$firebaseArray){

  $scope.$on('$ionicView.enter', function(e){
    $scope.userInfo={};
  });


  $scope.emailLogin = function(){
    console.log('buttun was clicked on login');

    $scope.user = $scope.userInfo;

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      templateUrl: 'templates/partials/login.html',
      title: 'Welcome to iWanna!',
      scope: $scope,
      buttons: [
        {
          text: '<b>ログイン</b>',
          type: 'button-energized',
          onTap: function(user) {
            Loading.show();
            user = $scope.user;
            $scope.userInfo=$scope.user;
            console.log('the user is ', user);
            Auth.login(user).then(function(){
            Loading.hide();
            console.log('login');
            $state.go('tab.dash');
            }, function(err) {
              Loading.hide();
                  var errmessage = err;
                  if (errmessage == "Error: The specified email address is invalid.") {
                    errmessage = "メールアドレスが間違っています.";
                  } else if (errmessage == "Error: Firebase.authWithPassword failed: First argument must contain the key \"email\" with type \"string\"") {
                    errmessage = "メールアドレスを入力してください.";
                  } else if (errmessage == "Error: Firebase.authWithPassword failed: First argument must contain the key \"password\" with type \"string\"") {
                    errmessage = "パスワードを入力してください.";
                  } else if (errmessage == "Error: The specified password is incorrect.") {
                    errmessage = "パスワードが間違っています.";
                  };
                  var alertPopup = $ionicPopup.alert({
                      title: "ログインエラー",
                      template: errmessage,
                  });
                  alertPopup.then(function(res) {
                       console.log('Callbacks');
                       $scope.emailLogin();
                     });

              console.log('Error...', err);
            });
          }
        },
        {
          text: '<b>登録</b>',
          type: 'button-calm',
          onTap: function(user) {
            Loading.show();
            user = $scope.user;
            console.log('the user is ', user);
            Auth.register(user).then(function(){
              return Auth.requireAuth()
                      .then(function(auth){
                        //登録時に運営とdefaultで友達になる
                        var ref = new Firebase(FURL);
                        var developerUid = "124797f2-5b56-47e6-aac3-3a4830f760b4";
                        var uid = auth.uid;
                        ref.child('follows').child(uid).child(developerUid).set(true);
                        ref.child('follows').child(developerUid).child(uid).set(true);
                        ref.child('followeds').child(uid).child(developerUid).set(true);
                        ref.child('followeds').child(developerUid).child(uid).set(true);
                        ref.child('matches').child(uid).child(developerUid).set(true);
                        ref.child('matches').child(developerUid).child(uid).set(true);
                        Loading.hide();
                        });
              Loading.hide();
            console.log('user was registered successfully');

            $state.go('tab.dash');
            }, function(err) {
              Loading.hide();
                  var errmessage = err;
                  if (errmessage == "Error: The specified email address is already in use.") {
                    errmessage = "そのメールアドレスは既に使われています.";
                  } else if (errmessage == "Error: Firebase.createUser failed: First argument must contain the key \"email\" with type \"string\"") {
                    errmessage = "メールアドレスを入力してください.";
                  } else if (errmessage == "Error: Firebase.createUser failed: First argument must contain the key \"password\" with type \"string\"") {
                    errmessage = "パスワードを入力してください.";
                  }　else if (errmessage == "Error: The specified email address is invalid.") {
                    errmessage = "無効なメールアドレスです.";
                  };
                  var alertPopup = $ionicPopup.alert({
                      title: "登録エラー",
                      template: errmessage,
                  });
                  alertPopup.then(function(res) {
                       console.log('Callbacks');
                       $scope.emailLogin();
                     });
              console.log('Error...', err);
            });

          }
        }
      ]
    });
  };


  var ref = new Firebase(FURL);
  var auth = $firebaseAuth(ref);



  $scope.TwitterLogin = function() {
    console.log("twclicked");
    auth.$authWithOAuthPopup("twitter", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        return authData
      }
    })
    .then(function(authData){
                        var uid = authData.uid;
                        var imgURL = { images : authData.twitter.profileImageURL};
                        console.log("test",$firebaseArray(ref.child('users').child(uid)));
                        var userRegister = {
                                name: authData.twitter.username,
                                email: "",
                                password: "",
                                intro: "User Information",
                                images : [imgURL],
                                twId : authData.twitter.id,
                        };
                        $firebaseArray(ref.child('users').child(uid)).$loaded().then(function(data) {
                            if (data.length == 0){//array==0 未登録
                                Auth.createProfile(uid,userRegister);
                                //運営と友達に
                                var developerUid = "124797f2-5b56-47e6-aac3-3a4830f760b4";
                                ref.child('follows').child(uid).child(developerUid).set(true);
                                ref.child('follows').child(developerUid).child(uid).set(true);
                                ref.child('followeds').child(uid).child(developerUid).set(true);
                                ref.child('followeds').child(developerUid).child(uid).set(true);
                                ref.child('matches').child(uid).child(developerUid).set(true);
                                ref.child('matches').child(developerUid).child(uid).set(true);
                                console.log("account data was created");
                            };
                        });

    });
    $state.go('tab.dash');
  };

    $scope.FacebookLogin = function() {
    console.log("fbclicked");
    auth.$authWithOAuthPopup("facebook", function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
        return authData
      }
    })
    .then(function(authData){
                        var uid = authData.uid;
                        var imgURL = { images : authData.facebook.profileImageURL};
                        console.log("test",$firebaseArray(ref.child('users').child(uid)));
                        var userRegister = {
                                name: authData.facebook.displayName,
                                email: "",
                                password: "",
                                intro: "User Information",
                                images : [imgURL],
                                fbId : authData.facebook.id,
                        };
                        $firebaseArray(ref.child('users').child(uid)).$loaded().then(function(data) {
                            if (data.length == 0){//array==0 未登録
                                Auth.createProfile(uid,userRegister);
                                //運営と友達に
                                var developerUid = "124797f2-5b56-47e6-aac3-3a4830f760b4";
                                ref.child('follows').child(uid).child(developerUid).set(true);
                                ref.child('follows').child(developerUid).child(uid).set(true);
                                ref.child('followeds').child(uid).child(developerUid).set(true);
                                ref.child('followeds').child(developerUid).child(uid).set(true);
                                ref.child('matches').child(uid).child(developerUid).set(true);
                                ref.child('matches').child(developerUid).child(uid).set(true);
                                console.log("account data was created");
                            };
                        });

    });
    $state.go('tab.dash');
  };





});
