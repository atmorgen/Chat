import { Component, OnInit, HostListener } from '@angular/core';
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
        let isUnique = this.glc.checkforUnique(userJSON,returnArr)
        
        if(isUnique){
          if(userName.length > 5 && passWord.length > 5){
            this.postData('logins/users',userJSON)
            this.closeNewUser()
          }else{
            document.getElementById('userExists').innerHTML = 'Name and Password should be greater than 5 characters.'
          }
        }else{
          document.getElementById('userExists').innerHTML = 'User already Exists...'
        }
    }) 
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
        let isUnique = this.glc.checkforUniquewithPass(userJSON,returnArr)
        
        if(isUnique){
          document.getElementById('loginExists').innerHTML = 'This ain\'t no login'
        }else{
          localStorage.setItem('userInfo',JSON.stringify(userJSON))
          this.switchToChat(userName)
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
          let isUnique = this.glc.checkforUnique(JSON.parse(local.userInfo),returnArr)
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
    this.checkForAFK()
    this.return()
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
          let input = JSON.parse(`
            {
              "user":"${userName}",
              "isAFK":"False"
            }`)
          var userKey = this.postData('onlineUsers/users',input)
          var jsonHolder = JSON.parse(localStorage.getItem('userInfo'))
          jsonHolder['onlineKey'] = userKey
          localStorage.setItem('userInfo',JSON.stringify(jsonHolder))
        }
      })
  }

  afkCount = 0;
  isAFK = false;

  @HostListener('document:keydown',['$event'])
    onkeydown(){
      this.returnFromAFK()
    }

  @HostListener('document:mousedown',['$event'])
    onmousedown(){
      this.returnFromAFK()
    }

  @HostListener('document:mousemove',['$event'])
    onmousemove(){
      this.returnFromAFK()
    }
  //subscribes to an event that runs when assignments have finished rendering
  return(){
    window.onfocus = x=> { this.returnFromAFK() };
  }

  /* Checking for AFK */
  checkForAFK(){
    this.isAFK = true
    this.returnFromAFK();
    setInterval(() => {
      this.afkCount++
      if(this.afkCount >= 10){
        this.setToAFK()
      }
    }, 30000);  
  }

  setToAFK(){
    if(!this.isAFK){
      this.isAFK = true;
      var key = JSON.parse(localStorage.getItem('userInfo')).onlineKey
      var userName = JSON.parse(localStorage.getItem('userInfo')).user + '(AFK)'
      this.db.database.ref('onlineUsers/users/' + key).update({'isAFK':this.isAFK})
      this.db.database.ref('onlineUsers/users/' + key).update({'user':userName})
    }
  }

  returnFromAFK(){
    if(this.isAFK){
      this.afkCount = 0;
      this.isAFK = false; 
      var key = JSON.parse(localStorage.getItem('userInfo')).onlineKey
      var userName = JSON.parse(localStorage.getItem('userInfo')).user
      this.db.database.ref('onlineUsers/users/' + key).update({'isAFK':this.isAFK})
      this.db.database.ref('onlineUsers/users/' + key).update({'user':userName})
    }
  }
}


