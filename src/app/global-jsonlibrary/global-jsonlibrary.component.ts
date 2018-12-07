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

  checkforUniquewithPass(input,returnArr){

    let compareInput = input
    let userDB = returnArr
    let isUnique: boolean = true;

    for(var i = 0;i<userDB.length;i++){
      if(userDB[i].user == compareInput.user){
        if(userDB[i].password == compareInput.password){
          isUnique = false;
          break;
        }
      }
    }
    return isUnique
  }

}
