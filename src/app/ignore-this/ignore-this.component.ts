import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'

@Component({
  selector: 'app-ignore-this',
  templateUrl: './ignore-this.component.html',
  styleUrls: ['./ignore-this.component.css']
})
export class IgnoreThisComponent implements OnInit {
  
  apiSummary = 'https://en.wikipedia.org/api/rest_v1/page/summary/'
  apiMedia = 'https://en.wikipedia.org/api/rest_v1/page/media/'
  apiMetadata = 'https://en.wikipedia.org/api/rest_v1/page/metadata/'
  apiRef = 'https://en.wikipedia.org/api/rest_v1/page/references/'
  apiTalk = 'https://en.wikipedia.org/api/rest_v1/page/html/'

  constructor(private db: AngularFireDatabase) { }

  count = 0;
  duplicatesArray = new Array();

  ngOnInit() {
    this.getAPISummary('League_of_Legends')
  }

  getAPISummary(search){
    let request = new XMLHttpRequest();

    request.open('GET', this.apiTalk + search, true);
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
                console.log('Existence Wins(count of: ' + this.count + ')')
                return;
              }else if(firstLink == 'Philosophy' || this.count > 100){
                console.log('Philosophy Wins(count of: ' + this.count + ')')
                return;
              }else if(firstLink.indexOf("differences") == -1 && firstLink.indexOf('Help') == -1 && firstLink.indexOf('language') == -1){
                this.count++
                console.log(firstLink)
                console.log(this.count)
                this.duplicatesArray.push(firstLink)
                this.getAPISummary(firstLink)
                return
              }
            }else{
              console.log('Infinite Loop of: ' + this.duplicatesArray[this.duplicatesArray.length - 1] + ' back to: ' + firstLink + ' (position: ' + (this.duplicatesArray.indexOf(firstLink)+1) + ')')
              return
            }
          }
        }
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

  




}
