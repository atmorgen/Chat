import { Component, OnInit, EmbeddedViewRef, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';

@Component({
  selector: 'app-global-jsonlibrary',
  templateUrl: './global-jsonlibrary.component.html',
  styleUrls: ['./global-jsonlibrary.component.css']
})
export class GlobalJSONLibraryComponent implements OnInit {

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef, private injector: Injector) { }

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

  appendComponentToBody(component: any,target){
    let componentRef;

    //Create a component reference from the component
    componentRef = this.componentFactoryResolver
    .resolveComponentFactory(component)
    .create(this.injector)

    //Attach comonent to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView)

    //Get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
    .rootNodes[0] as HTMLElement;

    //Append DOM element to the body
    document.getElementById(target).appendChild(domElem)

    return domElem
  }

  remove(target){
    //number of children of target
    let removeCount = target.children.length
    //remove each object one at a time
    for(var i = 0;i<removeCount;i++){
      target.children[0].remove()
    }
  }

}
