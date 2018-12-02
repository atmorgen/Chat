import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-global-jsonlibrary',
  templateUrl: './global-jsonlibrary.component.html',
  styleUrls: ['./global-jsonlibrary.component.css']
})
export class GlobalJSONLibraryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  userInfoJSON(userName,password){

    let output = JSON.parse(`
    {
      "user":"${userName}",
      "password":"${password}"
    }`)

    return output
  }



}
