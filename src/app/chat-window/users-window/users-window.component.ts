import { Component, OnInit, EmbeddedViewRef, ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database'
import { UserExpandComponent } from './user-expand/user-expand.component'

@Component({
  selector: 'app-users-window',
  templateUrl: './users-window.component.html',
  styleUrls: ['./users-window.component.css'],
  entryComponents:[UserExpandComponent]
})
export class UsersWindowComponent implements OnInit {

  usersNgFor: any;
  pmNgFor: any;

  constructor(private db: AngularFireDatabase, private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef, private injector: Injector) { }

  ngOnInit() {
    this.getData()
    this.logOutBrowserClose()
  }

  getData(){
    //find 'assignments reference in database and subscribe to it
    var dbUpdate = this.db.database.ref('onlineUsers/users').on('value',
      snapshot =>{
        var returnArr = [];
        snapshot.forEach(childSnapshot=> {
          var item = childSnapshot.val();
          
          returnArr.push(item);
        });
        this.usersNgFor = returnArr
    }) 
  }

  logOutBrowserClose(){

    
    window.addEventListener('beforeunload', x => {

      let local = JSON.parse(localStorage.userInfo)
      
      var dbUpdate = this.db.database.ref('onlineUsers').once('value',
        snapshot =>{
          var returnArr = [];
          snapshot.forEach(childSnapshot=> {
            var item = childSnapshot.val();
            
            returnArr.push(item);
          });
          
          /*
          for(var key in returnArr[0]){
            this.db.database.ref('test').push(returnArr[0][key].user)
            if(returnArr[0][key].user == local.user){
              this.db.database.ref('onlineUsers/users/' + key).remove()
              break;
            }
          }*/
      }) 
    });
  }

  /* USER Expand */

  expandUser(e){

    let target = e.target.innerText
    let childrenCount = e.target.children.length

    if(e.target.className == 'filterUsers'){
      if(childrenCount > 0){
        this.remove(e.target)
      }else{
        this.appendComponentToBody(UserExpandComponent,e.target)
      }
    }
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
    target.appendChild(domElem)
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
