'use strict'

app.factory('Wannas', function(FURL, $firebaseArray) {
              var ref =new Firebase(FURL);
              var wannas = $firebaseArray(ref.child('facebookuser').child('wannas'));//firebase構造によって変えてみてください。

              var Wannas ={
                all: function(){
                  return wannas;
                },

                saveWanna: function(wanna){
                  var newWanna={
                    user_name: 'mtmt',//名前取得できるように
                    content: wanna.content,
                    description: wanna.description,
                    icon: 'soccer'//アイコン取得できるように
                  };

                  return wannas.$add(newWanna).then(function(){
                    console.log('added to the database');
                  })
                }
              };
              return Wannas;
})
