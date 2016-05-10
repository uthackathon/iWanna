// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', [
  'ionic',
  'firebase',
  'ngCordova'
])

.service('$cordovaScreenshot', ['$q', function($q) {
    return {
        capture: function(filename, extension, quality) {
            extension = extension || 'jpg';
            quality = quality || '100';

            var defer = $q.defer();

            navigator.screenshot.save(function(error, res) {
                if (error) {
                    console.error(error);
                    defer.reject(error);
                } else {
                    console.log('screenshot saved in: ', res.filePath);
                    defer.resolve(res.filePath);
                }
            }, extension, quality, filename);

            return defer.promise;
        }
    };
}])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
  .constant('FURL', 'https://iwanna-app.firebaseio.com/')
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('login',{
     url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('twitter-share',{
     url: '/twitter-share',
    templateUrl: 'templates/twitter-share.html',
    controller: 'TwitterShareCtrl',
    resolve: {
                uid: function(Auth) {
                  return Auth.requireAuth()
                    .then(function(auth){
                      console.log(auth);
                      return auth.uid;
                  });
                }
              }
  })
  .state('facebook-share',{
     url: '/facebook-share',
    templateUrl: 'templates/facebook-share.html',
    controller: 'FacebookShareCtrl',
    resolve: {
                uid: function(Auth) {
                  return Auth.requireAuth()
                    .then(function(auth){
                      console.log(auth);
                      return auth.uid;
                  });
                }
              }
  })



  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl',
        resolve: {


                  uid: function(Auth) {
                    return Auth.requireAuth()
                      .then(function(auth){
                        console.log(auth);
                        return auth.uid;
                    });
                  }
                }
      }
    }
  })

  .state('tab.submit', {
    url: '/dash/submit',
    views: {
      'tab-dash': {
        templateUrl: 'templates/submit.html',
        controller: 'SubmitCtrl',
        resolve: {
                  uid: function(Auth) {
                    return Auth.requireAuth()
                      .then(function(auth){
                        console.log(auth);
                        return auth.uid;
                    });
                  }
                }
      }
    }
  })

  .state('tab.wanna-content', {
    url: '/dash/:wannaId',
    views: {
      'tab-dash': {
        templateUrl: 'templates/wanna-content.html',
        controller: 'WannaContentCtrl'
      }
    }
  })

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeCtrl',
        resolve: {
           

          uid: function(Auth) {
            return Auth.requireAuth()
              .then(function(auth){
                console.log(auth);
                return auth.uid;
            });
          }
        }

      }
    }
  })

  .state('tab.twitter-share', {
    url: '/home/twitter-share',
    views: {
      'tab-home': {
        templateUrl: 'templates/twitter-share.html',
        controller: 'TwitterShareCtrl',
        resolve: {
                  uid: function(Auth) {
                    return Auth.requireAuth()
                      .then(function(auth){
                        console.log(auth);
                        return auth.uid;
                    });
                  }
                }
      }
    }
  })

  .state('tab.searchfriends', {
    url: '/searchfriends',
    views: {
      'tab-searchfriends': {
        templateUrl: 'templates/tab-searchfriends.html',
        controller: 'SearchFriendsCtrl',
        resolve: {
           

          uid: function(Auth) {
            return Auth.requireAuth()
              .then(function(auth){
                console.log(auth);
                return auth.uid;
            });
          }
        }
        
      }
    }
  })

  .state('tab.messages', {
    url: '/messages',
    views: {
      'tab-messages': {
        templateUrl: 'templates/tab-messages.html',
        controller: 'MessagesCtrl',
        resolve: {
           

          uid: function(Auth) {
            return Auth.requireAuth()
              .then(function(auth){
                console.log(auth);
                return auth.uid;
            });
          }
        }
        
      }
    }
  })

  .state('tab.friends', {
    url: '/friends',
    views: {
      'tab-friends': {
        templateUrl: 'templates/tab-friends.html',
        controller: 'FriendsCtrl',
        resolve: {
           

          uid: function(Auth) {
            return Auth.requireAuth()
              .then(function(auth){
                return auth.uid;
            });
          }
        }
        
      }
    }
  })


  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl',
        resolve: {
           

          uid: function(Auth) {
            return Auth.requireAuth()
              .then(function(auth){
                console.log(auth);
                return auth.uid;
            });
          }
        }

      }
    }
  })



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
