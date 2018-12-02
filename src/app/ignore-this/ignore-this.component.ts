import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'

@Component({
  selector: 'app-ignore-this',
  templateUrl: './ignore-this.component.html',
  styleUrls: ['./ignore-this.component.css']
})
export class IgnoreThisComponent implements OnInit {

  
  apiMedia = 'https://en.wikipedia.org/api/rest_v1/page/media/'
  apiMetadata = 'https://en.wikipedia.org/api/rest_v1/page/metadata/'
  apiRef = 'https://en.wikipedia.org/api/rest_v1/page/references/'
  apiTalk = 'https://en.wikipedia.org/api/rest_v1/page/html/'

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.getAPISummary('Infant')
  }

  getAPISummary(search){
    let request = new XMLHttpRequest();
    let apiSummary = 'https://en.wikipedia.org/api/rest_v1/page/summary/'

    request.open('GET', apiSummary + search, true);
    request.onload = function(){
      var data = JSON.parse(this.response)
      return data.extract
      //console.log(this.response)
      //console.log(extractContent(this.response))

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
