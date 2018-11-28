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

  @HostListener('mousedown', ['$event'])
    onmousedown(e){
      this.target = e.target;
      if(e.target.id == 'wipeButton') this.wipe();
    }

  @HostListener('keyup',['$event'])
    onkeyup(e){
      if(this.target.id == 'textWindow' && e.key == "Enter"){
        let input = (<HTMLTextAreaElement>this.target).value.toString();
        (<HTMLTextAreaElement>this.target).value = '';
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
    }) 
  }

  jsonClean(input: string){
    let userName = (<HTMLInputElement>document.getElementById('userName')).value
    
    let output = JSON.parse(`
      {
        "user":"${userName}",
        "text":"${input.trim()}"
      }
    `);

    let location = 'chat/session';
    let key = document.getElementById('refKey').getAttribute('key');
    if(key != '') location = 'chat/' + key + '/session'
    console.log(location)
    this.postData(location,output);
  }

  wipe(){

    this.db.database.ref("chat").remove();

    let userName = (<HTMLInputElement>document.getElementById('userName')).value

    let output = JSON.parse(`{
      "session":[
        {
          "user":"${userName}",
          "text":"Database was Wiped"
        }
      ]
    }`)
    
    document.getElementById('refKey').setAttribute('key',this.postData('chat',output));
    
    
  }
  
  //This references the AngularFireBase db which is created in 
  postData(ref,input: JSON){
    var fbKey = this.db.database.ref(ref).push(input); 
    
    return fbKey.key
  }
}