import { Component, AfterViewInit, HostListener, ViewChildren } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'
import { IgnoreThisComponent } from '../ignore-this/ignore-this.component'

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements AfterViewInit {

  assignmentsNgFor:any;
  target: HTMLElement;
  userName;

  wiki:IgnoreThisComponent = new IgnoreThisComponent(this.db)

  constructor(private db: AngularFireDatabase) { 
      //determines the rate at which the DOM is checked for the ngFor updates from the database
      setInterval(() => {
        if(localStorage.userInfo != undefined){
          this.userName = JSON.parse(localStorage.userInfo).user
        }
      })
    }

  ngAfterViewInit() {
    //subscribe on init
    this.getData();
    this.newMessage();
    this.startFlash()
  }
  
  userPMSwitch(e){
    let value = e.target.value

    for(var i = 0;i<document.getElementsByClassName('userWindows').length;i++){
      (<HTMLElement>document.getElementsByClassName('userWindows')[i]).style.display = 'none'
    }

    document.getElementById(value).style.display = 'flex'
  }

  @HostListener('keyup',['$event'])
    onkeyup(e){
      if(document.getElementById('textWindow') == document.activeElement && e.key == "Enter"){
        let input = (<HTMLInputElement>document.getElementById('textWindow')).value.toString();
        (<HTMLTextAreaElement>document.getElementById('textWindow')).value = '';
        this.jsonClean(input)

        var callChecks = input.split(' ')


        if(callChecks[0].trim() == '/wipe') {
          this.wipe()
        }

        /* Wiki Calls */
        if(callChecks[0] == '/wiki' && callChecks[1].toLowerCase() == 'follow'){
          this.resetWikiTrails();
          this.wikiTrailFollow(callChecks[2])
        }else if(callChecks[0] == '/wiki') {
          this.wikipediaCall(callChecks[1])
        }
      }
    }
  
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
          localStorage.clear();
          location.reload();
      }) 
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

        if(!this.windowFocus){
          this.newMessageBoo = true;
        }
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
        jsonHolder[key].text.replace(/\\n/g, '\n')
        this.assignmentsNgFor.push(jsonHolder[key])
      }
    }
  }

  jsonClean(input: string){
    
    let output = JSON.parse(`
      {
        "user":"${this.userName}",
        "text":"${input.trim()}"
      }
    `);

    let key = document.getElementById('refKey').getAttribute('key');
    let location = 'chat/sessions/' + key + '/session' ;
    
    this.postChatData(location,output);
  }

  postChatData(ref,input){
    var dbUpdate = this.db.database.ref(ref).once('value',
        snapshot =>{
          var returnArr = [];
          var keys = [];
          snapshot.forEach(childSnapshot=> {
            var item = childSnapshot.val();
            keys.push(childSnapshot.key)
            returnArr.push(item);
          });

          //checking last message to see if the same user.  If it is then create a text bubble for all chat
          if(returnArr[returnArr.length-1].user == this.userName){
            var output = returnArr[returnArr.length-1].text + '\n' + input.text
            var key = keys[returnArr.length-1]
            var fbKey = this.db.database.ref(ref + '/' + key).update({'text':output})
          }else{
            var fbKey2 = this.db.database.ref(ref).push(input); 
            return fbKey2.key
          }
        })

    
  }

  wipe(){

    this.db.database.ref("chat/key").remove();

    let output = JSON.parse(`{
      "session":[
        {
          "user":"${this.userName}",
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

  /* WINDOW FLASHING FOR NEW MESSAGES */
  windowFocus = true;
  newMessageBoo = false;

  @HostListener('mousemove', ['$event'])
    onMousemove() {
      this.newMessageBoo = false;
      this.windowFocus = true;
    }
  
  @HostListener('keydown', ['$event'])
    onkeydown() {
      this.newMessageBoo = false;
      this.windowFocus = true;
    }

  newMessage(){
    window.onfocus = x=> { this.windowFocus = true; };
    window.onblur = x=> { this.windowFocus = false; }
  }

  startFlash(){

    let flash = false;
    let inter = setInterval(() => {
      if(this.newMessageBoo){
        flash = !flash
        if(flash) document.title = 'New Message'
        else document.title = 'Check yo Messages, Brah'
      }else{
        document.title = 'Chat'
      }
    }, 1500);
  }


  /* FOR WIKI */

  wikipediaCall(search){
    let request = new XMLHttpRequest();
    let apiSummary = 'https://en.wikipedia.org/api/rest_v1/page/summary/'

    request.open('GET', apiSummary + search, true);
    request.onload = x => {
      var response = JSON.parse(request.response).extract
      if(response != undefined){
        response = response.replace(/\n/g, " ")
        let output = response.replace(/"/g, '\\\"');
        this.wikiClean(output,'WikiBot')
      }else{
        this.wikiClean('This is not a thing, Sorry :(','WikiBot')
      }
      function extractContent(s) {
        var span= document.createElement('span');
        span.innerHTML= s;
          var children= span.querySelectorAll('*');
          for(var i = 0 ; i < children.length ; i++) {
            if(children[i].textContent)
              children[i].textContent+= ' ';
            else
              (<HTMLElement>children[i]).innerText+= ' ';
          }
        
        return [span.textContent || span.innerText].toString().replace(/ +/g,' ');
      };
    }
    // Send request
    request.send();
  } 

  /* this is the method to run the wiki trail */
  count = 0;
  duplicatesArray = new Array();
  post = '';

  resetWikiTrails(){
    this.post = '';
    this.duplicatesArray = new Array();
    this.count = 0;
  }
  
  wikiTrailFollow(search){
    
    let request = new XMLHttpRequest();
    
    request.open('GET', 'https://en.wikipedia.org/api/rest_v1/page/html/' + search, true);
    request.onload = x => {
      let firstLink = '';

      var el = document.createElement('html')
      el.innerHTML = request.response

      var tables = el.getElementsByTagName('table')
      for(var i = 0;i<tables.length;i++){
        tables[i].parentNode.removeChild(tables[i])
      }

      var holder = el.getElementsByTagName('p')
      for(var i = 0;i<holder.length;i++){
        var data2 = holder[i].innerHTML.split('mw:WikiLink" href="./')
          for(var j = 1;j<data2.length;j++){
            if(data2[j] != undefined){
              var output = data2[j].split('"')
              firstLink = output[0]

              if(!this.duplicatesArray.includes(firstLink)){
                if(firstLink == 'Existence' || this.count > 100){
                  this.post += 'Existence Wins(count of: ' + this.count + ')' 
                  this.wikiClean(this.post,'WikiBot')
                  return;
                }else if(firstLink == 'Philosophy' || this.count > 100){
                  this.post += 'Philosophy Wins(count of: ' + this.count + ')'
                  this.wikiClean(this.post,'WikiBot')
                  return;
                }else if(firstLink.indexOf("differences") == -1 && firstLink.indexOf('Help') == -1 && firstLink.indexOf('language') == -1){
                  this.count++
                  console.log(this.count)
                  let space = '   ';
                  if(this.count <= 9){
                    space += '  '
                  }
                  this.post += 'Count: ' + this.count + space + ' Page: ' + firstLink + '\\n'
                  this.duplicatesArray.push(firstLink)
                  this.wikiTrailFollow(firstLink)
                  return
                }
              }else{
                this.post += 'Infinite Loop of: ' + this.duplicatesArray[this.duplicatesArray.length - 1] + ' back to: ' + firstLink + ' (position: ' + (this.duplicatesArray.indexOf(firstLink)+1) + ')'
                this.wikiClean(this.post,'WikiBot')
                return
              }
          }
        }
      }
      if(this.post == ''){
        this.wikiClean('Please be more specific','WikiBot')
      }
      
      function extractContent(s) {
        var span= document.createElement('span');
        span.innerHTML= s;
          var children= span.querySelectorAll('*');
          for(var i = 0 ; i < children.length ; i++) {
            if(children[i].textContent)
              children[i].textContent+= ' ';
            else
              (<HTMLElement>children[i]).innerText+= ' ';
          }
        
        return [span.textContent || span.innerText].toString().replace(/ +/g,' ');
      };
    }
    // Send request
    request.send();
  }
  
  wikiClean(input: string,name){
    
    let output = JSON.parse(`
      {
        "user":"${name}",
        "text":"${input.trim()}"
      }
    `);

    let key = document.getElementById('refKey').getAttribute('key');
    let location = 'chat/sessions/' + key + '/session' ;
    
    this.postData(location,output);
  }
}