import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'

@Component({
  selector: 'app-users-window',
  templateUrl: './users-window.component.html',
  styleUrls: ['./users-window.component.css']
})
export class UsersWindowComponent implements OnInit {

  usersNgFor: any;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.getData()
    this.logOutBrowserClose()
  }

  getData(){
    //find 'assignments reference in database and subscribe to it
    var dbUpdate = this.db.database.ref('onlineUsers/users').on('value',
      snapshot =>{
        var returnArr = [];
        snapshot.forEach(childSnapshot=> {
          var item = childSnapshot.val();
          
          returnArr.push(item);
        });
        this.usersNgFor = returnArr
    }) 
  }

  /* LOGOUT */

  logOut(){

    let local = JSON.parse(localStorage.userInfo)

    var dbUpdate = this.db.database.ref('onlineUsers').once('value',
      snapshot =>{
        var returnArr = [];
        snapshot.forEach(childSnapshot=> {
          var item = childSnapshot.val();
          
          returnArr.push(item);
        });

        for(var key in returnArr[0]){
          if(returnArr[0][key].user == local.user){
            this.db.database.ref('onlineUsers/users/' + key).remove()
            break;
          }
        }
    }) 

    localStorage.clear();
    location.reload();
  }

  logOutBrowserClose(){

    
    window.addEventListener('beforeunload', x => {

      let local = JSON.parse(localStorage.userInfo)
      
      var dbUpdate = this.db.database.ref('onlineUsers').once('value',
        snapshot =>{
          var returnArr = [];
          snapshot.forEach(childSnapshot=> {
            var item = childSnapshot.val();
            
            returnArr.push(item);
          });
          
          /*
          for(var key in returnArr[0]){
            this.db.database.ref('test').push(returnArr[0][key].user)
            if(returnArr[0][key].user == local.user){
              this.db.database.ref('onlineUsers/users/' + key).remove()
              break;
            }
          }*/
      }) 
    });
  }

}
