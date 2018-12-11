import { Component, OnInit, ElementRef, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { GlobalJSONLibraryComponent } from '../../../global-jsonlibrary/global-jsonlibrary.component'

@Component({
  selector: 'app-user-expand',
  templateUrl: './user-expand.component.html',
  styleUrls: ['./user-expand.component.css']
})
export class UserExpandComponent implements OnInit {

  glc: GlobalJSONLibraryComponent = new GlobalJSONLibraryComponent(this.componentFactoryResolver,this.appRef,this.injector);

  constructor(private elRef: ElementRef,private db: AngularFireDatabase,private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef, private injector: Injector) { }

  ngOnInit() { 
  }

  /* Checks to make sure privateMessage doesn't already exist.  If it doesn't then create a private
  message Instance and place the keys within each users db */
  async privateMessage(){
    //get this user
    let self = JSON.parse(localStorage.getItem('userInfo'));
    //get the target
    let targetUser = this.elRef.nativeElement.parentElement.firstChild.nodeValue    
    
    //if you're not trying to start a pm with yourself
    if(self.user != targetUser){
      //async function that returns whether or not a pm has already been made between the two parties
      let isPresent = await this.checkForPM(self,targetUser);
      
      //if not pm has been made
      if(!isPresent){
        //create instance of the pm
        var pmKey = this.db.database.ref('privateMessages/sessions').push(this.InitPMJSON(self.user,targetUser))
        //push the pm info to both parties
        this.addPM(self,targetUser,pmKey.key)
      }else{
        
      }
    }
  }

  //async function that returns whether or not a pm has already been made between the two parties
  checkForPM(self,targetUser){
    //if pm already exists
    let isPresent = false;
    //db
    let dbCall = this.db;

    return new Promise(function(resolve,reject) {
      var dbUpdate = dbCall.database.ref('logins/users').once('value',
        snapshot =>{
          var returnArr = [];
          snapshot.forEach(childSnapshot=> {
            
            var item = childSnapshot.val();
            returnArr.push(item);
          });
          
          //finds the correct user out of logins
          for(var i = 0;i<returnArr.length;i++){
            if(returnArr[i].user == self.user){
              //for each of private message of the user
              for(var key in returnArr[i].privateMessages){
                let userTargets = returnArr[i].privateMessages[key].users
                //for each other user within the private message
                for(var k = 0;k<userTargets.length;k++){
                  if(userTargets[k].userTarget == targetUser){
                    isPresent = true;
                    break;
                  }
                }
              }
            }
          }
          resolve(isPresent)
        })
      })
  }

  /* Adds a new PM to the privateMessages DB and also the pmKey to 'self' personal DB and to 
  'target personal DB */
  addPM(self,target,pmKey){

    var dbUpdate = this.db.database.ref('logins/users').once('value',
      snapshot =>{
        var returnArr = [];
        snapshot.forEach(childSnapshot=> {
          
          var item = childSnapshot.val();
          returnArr.push(item);
        });
        
        //adds the pm information to 'self' personal db
        for(var i = 0;i<returnArr.length;i++){
          if(returnArr[i].user == self.user){
            let key = Object.keys(snapshot.val())[i]
            this.db.database.ref('logins/users/' + key + '/privateMessages').push(this.addPMtoUserJSON(target,pmKey))
          }
        }

        //adds the pm information to 'target' personal db
        for(var i = 0;i<returnArr.length;i++){
          if(returnArr[i].user == target){
            let key = Object.keys(snapshot.val())[i]
            this.db.database.ref('logins/users/' + key + '/privateMessages').push(this.addPMtoUserJSON(self.user,pmKey))
          }
        }
      })
  }

  addPMtoUserJSON(target,key){
    let output = JSON.parse(`
      {
        "users":[
          {
            "userTarget":"${target}"
          }
        ],
        "pmKey":"${key}"
      }
    `)
    return output
  }

  InitPMJSON(user1,user2){
    let output = JSON.parse(`
      { 
        "users":[
          {
            "user":"${user1}"
          },
          {
            "user":"${user2}"
          }
        ],
        "session":[
          {
            "user":"${user1}",
            "text":"Conversation started with ${user2}"
          }
        ]
      }
    `)
    return output
  }

  userPMJSON(targetUser,key){
    let output = JSON.parse(`
    {
      "targetUser":"${targetUser}",
      "pmKey":"${key}"
    }
    `)
    return output
  }

}
