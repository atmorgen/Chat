import { Component, OnInit, HostListener } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {

  assignmentsNgFor:any;
  target: HTMLElement;

  constructor(private db: AngularFireDatabase) { 
      //determines the rate at which the DOM is checked for the ngFor updates from the database
      setInterval(() => {
      })
    }

  ngOnInit() {
    //subscribe on init
    this.getData();
  }

  @HostListener('keyup',['$event'])
    onkeyup(e){
      if(document.getElementById('textWindow') == document.activeElement && e.key == "Enter"){
        let input = (<HTMLInputElement>document.getElementById('textWindow')).value.toString();
        (<HTMLTextAreaElement>document.getElementById('textWindow')).value = '';
        this.jsonClean(input)
        if(input.trim() == '/wipe') this.wipe()
      }
    }

  getData(){
    //find 'assignments reference in database and subscribe to it
    var dbUpdate = this.db.database.ref('chat').on('value',
      snapshot =>{
        var returnArr = [];
        snapshot.forEach(childSnapshot=> {
          var item = childSnapshot.val();
          
          returnArr.push(item);
        });
        this.getKey(returnArr)
        this.updateNgFor(returnArr)
        setTimeout(() => {
          document.getElementById('assignmentViewCanvas').scrollTop = document.getElementById('assignmentViewCanvas').scrollHeight;
        }, 200);
        
    }) 
  }

  getKey(returnArr){

    if(returnArr.length == 2){
      let key = '';

      for(key in returnArr[0]){
        key = returnArr[0][key]
        document.getElementById('refKey').setAttribute('key',key)
      }
    }
  }

  updateNgFor(returnArr){

    let key = document.getElementById('refKey').getAttribute('key')
    if(returnArr.length == 2){
      let jsonHolder = returnArr[1][key]['session'];
      this.assignmentsNgFor = JSON.parse('[]')

      for(key in jsonHolder){
        this.assignmentsNgFor.push(jsonHolder[key])
      }
    }
  }

  jsonClean(input: string){
    let userName = (<HTMLInputElement>document.getElementById('userName')).value
    
    let output = JSON.parse(`
      {
        "user":"${userName}",
        "text":"${input.trim()}"
      }
    `);

    let key = document.getElementById('refKey').getAttribute('key');
    let location = 'chat/sessions/' + key + '/session' ;
    
    this.postData(location,output);
  }

  wipe(){

    this.db.database.ref("chat/key").remove();

    let userName = (<HTMLInputElement>document.getElementById('userName')).value

    let output = JSON.parse(`{
      "session":[
        {
          "user":"${userName}",
          "text":"Database was Wiped"
        }
      ]
    }`)
    
    this.postData('chat/key',this.postData('chat/sessions',output));
        
  }

  //This references the AngularFireBase db which is created in 
  postData(ref,input){
    var fbKey = this.db.database.ref(ref).push(input); 
    
    return fbKey.key
  }
}