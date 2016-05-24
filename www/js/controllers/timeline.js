'use strict'

app.controller('DashCtrl', function(uid,usr,$scope,$state,Wannas,SharedStateService,Match,$timeout,FURL, $firebaseArray,Message) {
               //ログインする前に uid を参照しようとするとエラーとなるので注意。
               //エラー処理については http://uhyohyo.net/javascript/9_8.html
               //ログインする前にuid は使えないので、エラー処理を入れた。(結局、抜いた)
                              $scope.imageLog=0;
               var currentUid = uid;
               var allwanna=Wannas.all(currentUid);
               $scope.friendidList = [uid];
               var likedWannaList=[];
               var likeValid=false;
               var nameTest=usr;
               var roomList = [];

               $scope.friendImages ={'initUid':'initImg'};

               console.log('userName gained before html',nameTest,uid);
               var flag =0;

                var fb = new Firebase(FURL);

                $scope.testimage = $firebaseArray(fb.child("users").child(currentUid).child("images"));

                $scope.images = function(userid){
                  var ref = fb.child("users").child(userid).child("images");
                  var sync = $firebaseArray(ref);
                  return sync[0];
                  console.log(sync);
                };

                $scope.uicon = function(userid){
                  var localref = fb.child("users").child(userid).child("images");
                  return $firebaseArray(localref)[0].images;
                };

                $scope.date = function(dayInt){
                  var dayString = String(dayInt);
                  var month = Number(dayString.substr(4,2));
                  var day = Number(dayString.substr(6,2));
                  var hour = Number(dayString.substr(8,2));
                  var min = Number(dayString.substr(10,2));
                  var date = month+"月"+day+"日 "+hour+"時"+min+"分";
                  return date;
                }


                $scope.getFriendsImage=function(fList,flag){
                        Wannas.imageAll(fList[flag]).$loaded().then(function(images){
                              console.log('images',images);
                              console.log('flist[flag]',fList[flag]);
                              console.log('flag',flag);
                              if(images[0]==null){images=[{'images' :'noImage'},{'images':'noImage'}];console.log('undefined',images['images']);}
//                              console.log('image',fList[k],images);
                              $scope.friendImages[fList[flag]]=images[0]['images'];
                              if(flag<fList.length-1){
                                console.log('fList length',fList.length);
                                flag+=1;
                                $scope.getFriendsImage(fList,flag);
                              }else{
                              flag=0;
                              }
                        },function(error){
                          console.log('oh no! no images file');
                        });
                };

                Match.allMatchesByUser(uid).$loaded().then(function(data) {
                //$loadedを使わないとlengthが正常動作しない（違うとこのlengthを参照する）
                      for (var i = 0; i < data.length; i++) {
                          var item = data[i];
                          $scope.friendidList.push(item.$id);
                          Wannas.all(item.$id).$loaded().then(function(friendwanna) {
                            for (var j = 0; j < friendwanna.length; j++) {
                              allwanna.push(friendwanna[j]);
                            }
                          });
                      }
                    console.log("allwanna is",allwanna);
                    console.log("friend ids are",$scope.friendidList);
                });


                  $scope.wannas = function(){
                        allwanna.sort(function(a,b){//上の動作が終わった後にしたい
                          return b.upload_time - a.upload_time;
                        });
                        return allwanna;
                      };

//               $scope.$watch("wannas",function(){
//                var likeValid=0;
//                console.log("scope.wannas is changed");
//               });
                Message.getAllRooms(uid).$loaded().then(function(data) {
                //$loadedを使わないとlengthが正常動作しない（違うとこのlengthを参照する）
                      for (var i = 0; i < data.length; i++) {
                          var item = data[i];
                          roomList.push(item);
                      }
                      console.log("roomList is",roomList);
             
                });


                Message.getAllRooms(uid).$loaded().then(function(data) {
                //$loadedを使わないとlengthが正常動作しない（違うとこのlengthを参照する）
                      for (var i = 0; i < data.length; i++) {
                          var item = data[i];
                          roomList.push(item);
                      }
                      console.log("roomList is",roomList);
             
                });

               $scope.writeWanna=function(){
               console.log("write button was clicked");
               $state.go('tab.submit');//state.goディレクトリ関係がわからない
               };

               $scope.goContentPage=function(wanna){
                  console.log("goContent button was clicked");
                  $state.go('tab.wanna-content');
                  //ダッシュページと内容ページでWanna 情報をやりとりするためにSharedStateService に入れた値を共有する。
                  // http://whiskers.nukos.kitchen/2015/05/21/angularjs-controller-coordination.html のShared Service などを参考にした。
                  SharedStateService.clickedWanna=wanna;
                  $scope.clickedWanna=wanna;
                  console.log("timeline",wanna.content);
               };

               $scope.$watch('friendidList',function(){
                    console.log('friends ids changed',$scope.friendidList);
                    flag=0;
                    $scope.getFriendsImage($scope.friendidList,flag);
               });

               $scope.myFunction = function(isLast,wanna){
                 if(isLast){//html の表示が終わった時に動く内容 （like の色付け）
                    console.log("the end of repeat",wanna.$id);

                    //friend list の画像取得

                   $timeout(function(){
                    likedWannaList=Wannas.findUsersLikes($scope.wannas,currentUid);
                    for(var i = 0; i < likedWannaList.length; i++){
                        var pretarget = document.getElementById(likedWannaList[i]);
                        pretarget.style.backgroundColor='#FFFFFF';
                        pretarget.style.color='#FFC0CB';
                    }
                    likeValid=true;
                    console.log("like valid phase");
                                       flag=0;
                                       $scope.getFriendsImage($scope.friendidList,flag);

                   },200);



                 }
               };


               $scope.likeWanna=function(wanna){
                      console.log("like button was clicked");
                     // wanna.ownerId=currentUid;//test用の緊急処理。wanna 全てにownerId を書き込んでこの行を消すべし
                     //<ion-spinner icon="lines" class="spinner-calm"></ion-spinner>
                     if(likeValid){//likeValid が1のときだけ、like ボタンが有効
                        var likeButton = document.getElementById(wanna.$id);
                        var buttonColor=likeButton.style.color;
                        console.log("button color",buttonColor);
                        if(buttonColor){//likeボタンがすでに色つきの時(like してるとき)
                            console.log("colorful");
                            Wannas.removeLikeFromWanna(wanna.ownerId,wanna.$id,currentUid,likeButton);
                            Wannas.removeLikeFromUser(wanna.ownerId,wanna.$id,currentUid,likeButton);
                        }else{//likeにまだ色がついてない時(like してないとき)
                            Wannas.addLikeToWanna(wanna.ownerId,wanna.$id,currentUid,likeButton);
                            Wannas.addLikeToUser(wanna.ownerId,wanna.$id,currentUid,likeButton);
                            //はい or いいえが欲しい
                            console.log(_.contains(_.pluck(roomList, 'friendId'),wanna.ownerId));
                            if(_.contains(_.pluck(roomList, 'friendId'),wanna.ownerId)){//すでに友達とのroomが存在するとき
                              var likedRoomId = roomList[_.indexOf(_.pluck(roomList, 'friendId'),wanna.ownerId)].roomId
                              var message = "Hi! I like your plan; " + wanna.content ;
                              Message.sendMessage(message,uid,likedRoomId);
                            }
                            else{
                              console.log("create new messgage room")
                              Message.createNewRoom(uid,wanna.ownerId);
                              var message = "Hi! I like your plan; " + wanna.content ;
                              Message.sendMessage(message,uid,likedRoomId);                             
                            }
                        }
                      }else{
                        console.log("like button is not valid");
                      }

                      ;


               };

                //wannasの検索、とりあえずserchFriendsからコピー
                //検索窓からの取り込み=tipsToFind
                $scope.searchWannas = function(tipsToFind){
                    if (tipsToFind == "") {
                    //検索窓が空欄の時は検索前に戻す(全部が当てはまるという検索の時間省略のため)
                        $scope.wannas =allwanna;
                        console.log('reset');
                        var likeValid=false;
                    }
                    else {//検索部
                        $scope.serchwannas = [];
                        console.log("searching...",tipsToFind);
                        for (var i = 0; i < allwanna.length; i++){
                            var item = allwanna[i];
                            var serchword = new RegExp(tipsToFind);
                            if ( item.content.match(serchword) || item.description.match(serchword)) {
                                $scope.serchwannas.push(item);
                                //列に検索されたものを追加
                            }
                        }

                        if ($scope.serchwannas.length !== 0){//ヒットしたとき
                            $scope.wannas = $scope.serchwannas
                            console.log('searched wannas are',$scope.wannas);
                        }
                        else if ($scope.serchwannas.length == 0){//何もヒットしなかったときは表示なし
                            $scope.wannas =　[]
                            console.log('wannas are not finded');
                        }
                    }
                };

})
