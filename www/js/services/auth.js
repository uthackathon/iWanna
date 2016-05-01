'use strict'

app.factory('Auth', function(FURL, $firebaseAuth, $firebaseObject, $state, $firebaseArray) {
  var ref = new Firebase(FURL);
  var auth = $firebaseAuth(ref);

  var Auth = {

    user:{},

    createProfile: function(uid,user) {
      return ref.child('profiles').child(uid).set(user);
      // return profiles.child(uid).$add("test");
   
    },

    getProfile: function(uid) {
      return $firebaseObject(ref.child('profiles').child(uid));
    },
    
    getUid: function() {
      return auth.$requireAuth()
        .then(function(auth){
          return auth.uid;
        });
    },
        
      

    getProfiles: function(){
      return $firebaseArray(ref.child('profiles'));
    },

    login: function(user){
      console.log('we got to login function');
      return auth.$authWithPassword({
        email: user.email,
        password: user.password
      }).then(function(authData){
        
        console.log(authData);
    
        
      });
    },

    register: function(user){
      
      console.log('in the register');
      return auth.$createUser({ 
        email: user.email,
        password: user.password
      }).then(function(authData){
        
        console.log('user is saving');
        Auth.createProfile(authData.uid,user)
        return Auth.login(user);
        
      })
    },

    requireAuth: function(){
      return auth.$requireAuth();
    },

    logout: function(){
      auth.$unauth();
    }
  }




  auth.$onAuth(function(authData){
    if(authData){

      Auth.user = authData;
      console.log('the user has already logged in');
      $state.go('tab.dash');
    }else{
      // Auth.createProfile(authData.uid);
      $state.go('login');
    }
  })
  return Auth;
});
