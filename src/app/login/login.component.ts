import { Component, OnInit } from '@angular/core';
import { GlobalJSONLibraryComponent } from '../global-jsonlibrary/global-jsonlibrary.component'
import { AngularFireDatabase } from 'angularfire2/database'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hasStorage: boolean = false
  glc: GlobalJSONLibraryComponent = new GlobalJSONLibraryComponent;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.checkforStorage()
  }

  openNewUserScreen(){
    document.getElementById('newUserScreen').style.display = 'inline-block'
  }

  closeNewUser(){
    document.getElementById('newUserScreen').style.display = 'none';
  }

  createNewUser(){
    this.getData()
  }

  getData(){

    let userName = (<HTMLInputElement>document.getElementById('newUserName')).value
    let passWord = (<HTMLInputElement>document.getElementById('newPassword')).value
    let userJSON = this.glc.userInfoJSON(userName,passWord)

    //find 'assignments reference in database and subscribe to it
    var dbUpdate = this.db.database.ref('logins/users').once('value',
      snapshot =>{
        var returnArr = [];
        snapshot.forEach(childSnapshot=> {
          var item = childSnapshot.val();
          
          returnArr.push(item);
        });
        let isUnique = this.checkforUnique(userJSON,returnArr)
        
        if(isUnique){
          this.postData('logins/users',userJSON)
          this.closeNewUser()
        }else{
          document.getElementById('userExists').innerHTML = 'User already Exists...'
        }
    }) 
  }

  checkforUnique(input,returnArr){

    let compareInput = input
    let userDB = returnArr
    let isUnique: boolean = true;

    for(var i = 0;i<userDB.length;i++){
      if(userDB[i].user == compareInput.user){
          isUnique = false;
          break;
      }
    }
    return isUnique
  }

  //This references the AngularFireBase db which is created in 
  postData(ref,input){
    var fbKey = this.db.database.ref(ref).push(input); 
    
    return fbKey.key
  }

  /* FOR LOGIN */
  login(){

    let userName = (<HTMLInputElement>document.getElementById('userName')).value
    let passWord = (<HTMLInputElement>document.getElementById('passWord')).value
    let userJSON = this.glc.userInfoJSON(userName,passWord)

    //find 'assignments reference in database and subscribe to it
    var dbUpdate = this.db.database.ref('logins/users').once('value',
      snapshot =>{
        var returnArr = [];
        snapshot.forEach(childSnapshot=> {
          var item = childSnapshot.val();
          
          returnArr.push(item);
        });
        let isUnique = this.checkforUnique(userJSON,returnArr)
        
        if(isUnique){
          document.getElementById('loginExists').innerHTML = 'This ain\'t no login'
        }else{
          this.switchToChat(userName)
          localStorage.setItem('userInfo',JSON.stringify(userJSON))
        }
      })
  }

  checkforStorage(){

    var local = localStorage

    //find 'assignments reference in database and subscribe to it
    var dbUpdate = this.db.database.ref('logins/users').once('value',
      snapshot =>{
        var returnArr = [];
        snapshot.forEach(childSnapshot=> {
          var item = childSnapshot.val();
          
          returnArr.push(item);
        });
        if(local.userInfo != undefined){
          let isUnique = this.checkforUnique(JSON.parse(local.userInfo),returnArr)
          if(!isUnique){
            this.switchToChat(JSON.parse(local.userInfo).user)
          }
        }
      })
  }

  switchToChat(userName){
    document.getElementById('loginPage').style.display = 'none'
    document.getElementById('Assignments').style.display = 'block'

    this.compareToUsers(userName)
  }

  compareToUsers(userName){

    let alreadyOnline: boolean = false;

    var dbUpdate = this.db.database.ref('onlineUsers/users').once('value',
      snapshot =>{
        var returnArr = [];
        snapshot.forEach(childSnapshot=> {
          var item = childSnapshot.val();
          
          returnArr.push(item);
        });

        for(var i = 0;i<returnArr.length;i++){
          if(returnArr[i].user == userName){
            alreadyOnline = true;
            break;
          }
        }
        if(!alreadyOnline){
          let input = JSON.parse(`{"user":"${userName}"}`)
          this.postData('onlineUsers/users',input)
        }
      })
  }
}
