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
    }

  @HostListener('keyup',['$event'])
    onkeyup(e){
      if(this.target.id == 'textWindow' && e.key == "Enter"){
        let input = (<HTMLTextAreaElement>this.target).value
        console.log(input)
      }
    }

  getData(){
    //find 'assignments reference in database and subscribe to it
    var dbUpdate = this.db.database.ref('chat').on('value',
      snapshot =>{
        var returnArr = [];
        snapshot.forEach(childSnapshot=> {
          var item = childSnapshot.val();
          item.studyRefKey = childSnapshot.key;
          
          returnArr.push(item);
        });
    }) 
  }

  enter(){
    
  }

key;
//This references the AngularFireBase db which is created in 
postData(ref,id){
  var updates = {};
  let jsonHolder = JSON.parse(document.getElementById('visitDatabase').getAttribute('dataset'))
  updates[jsonHolder.studyRefKey] = JSON.parse(document.getElementById(id).getAttribute('dataset'));
  
  if(jsonHolder.studyRefKey == ""){
    var fbKey = this.db.database.ref(ref).push(JSON.parse(document.getElementById(id).getAttribute('dataset'))); 
    this.key = fbKey.key;
    jsonHolder.studyRefKey = fbKey.key
    document.getElementById('visitDatabase').setAttribute('dataset',JSON.stringify(jsonHolder))
  }else{
    this.db.database.ref(ref).update(updates);
  }
  this.getData()
}
  

}