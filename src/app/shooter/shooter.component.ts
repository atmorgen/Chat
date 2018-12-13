import { Component, OnInit, HostListener, ComponentFactoryResolver, 
  ApplicationRef, Injector } from '@angular/core';
import { GlobalJSONLibraryComponent } from '../global-jsonlibrary/global-jsonlibrary.component'
import { PlayerComponent } from './player/player.component'
import { AngularFireDatabase } from 'angularfire2/database'

@Component({
  selector: 'app-shooter',
  templateUrl: './shooter.component.html',
  styleUrls: ['./shooter.component.css'],
  entryComponents:[PlayerComponent]
})
export class ShooterComponent implements OnInit {

  constructor(private db: AngularFireDatabase,private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef, private injector: Injector) { }

  glc:GlobalJSONLibraryComponent = new GlobalJSONLibraryComponent(this.componentFactoryResolver,this.appRef,this.injector)
  inGame: boolean = false;
  playerCount = 0;

  ngOnInit() {
    document.getElementById('gameMode').style.display = 'none';
    this.searchForPlayers();
  }

  @HostListener('document:keydown', ['$event'])
    onkeydown(e){
      if(this.inGame) this.move(e)
    }
  
  player;
  joinGame(){

    document.getElementById('joinGameButton').style.display = 'none';
    var width = document.getElementById('gameMode').offsetWidth;
    var height = document.getElementById('gameMode').offsetHeight;

    this.player = this.glc.appendComponentToBody(PlayerComponent,'gameMode').children[0]

    const rngWidth = Math.floor((Math.random() * width) + 1);
    const rngHeight = Math.floor((Math.random() * height) + 1);

    this.player.innerHTML = JSON.parse(localStorage.getItem('userInfo')).user
    this.player.style.left = rngWidth + 'px';
    this.player.style.top = rngHeight + 'px';

    this.inGame = true;
    this.postData(this.player.style.left,this.player.style.top)
  }

  move(e){
    
    let x = parseFloat(this.player.style.left);
    let y = parseFloat(this.player.style.top);
    let key = e.key;

    let width = document.getElementById('gameMode').offsetWidth
    let height = document.getElementById('gameMode').offsetHeight

    let step = 30;

    switch(key){
      case 'a' :
        if((x-step) < 0){
          this.player.style.left = '5px';
        }else{
          this.player.style.left = (x-step) + 'px';
        }        
        break;
      case 's':
        if((y+step) > height-50){
          this.player.style.top = (height-50) + 'px';
        }else{
          this.player.style.top = (y+step) + 'px';
        }
        break;
      case 'd':
        if((x+step) > width){
          this.player.style.left = (width-20) + 'px';
        }else{
          this.player.style.left = (x+step) + 'px';
        }
        break;
      case 'w':
        if((y-step) < 0){
          this.player.style.top = '-10px';
        }else{
          this.player.style.top = (y-step) + 'px';
        }
        break;
    }

    let xOutput = this.player.style.left;
    let yOutput = this.player.style.top;

    this.postData(xOutput,yOutput)
  }
  
  gameKey;
  postData(x,y){

    let output = JSON.parse(`
      {
        "player":"${JSON.parse(localStorage.getItem('userInfo')).user}",
        "x":"${x}",
        "y":"${y}"
      }    
    `)
    
    if(this.gameKey == undefined){
      var gameDB = this.db.database.ref('game').push(output)
      this.gameKey = gameDB.key;
    }else{
      this.db.database.ref('game/' + this.gameKey).update(output)
    }
  }

  players = [];
  searchForPlayers(){

    this.db.database.ref('game').on('value',
    snapshot =>{
      var returnArr = [];
      var keys = [];
      snapshot.forEach(childSnapshot=> {
        var item = childSnapshot.val();
        
        keys.push(childSnapshot.key)
        returnArr.push(item);
      });
      
      if(returnArr.length > this.playerCount){
        for(var i = this.playerCount;i<returnArr.length;i++){
          if(JSON.parse(localStorage.getItem('userInfo')).user != returnArr[i].player){
            var player = this.glc.appendComponentToBody(PlayerComponent,'gameMode').children[0]
            
            player.innerHTML = returnArr[i].player;
            (<HTMLElement>player).style.left = returnArr[i].x;
            (<HTMLElement>player).style.top = returnArr[i].y;

            this.players.push((<HTMLElement>player))
          }
        }
        this.playerCount = returnArr.length;
      }else if(this.playerCount > returnArr.length){
        for(var i = 0;i<this.players.length;i++){
          var hostedPlayer = this.players[i].innerHTML
          var isPresent: boolean = false;

          for(var j = 0;j<returnArr.length;j++){
            if(hostedPlayer == returnArr[j].player){
              isPresent = true;
              break;
            }
          }
          if(!isPresent){
            this.glc.remove((<HTMLElement>this.players[i]).parentElement)
            this.players.splice(i,1)
          }
        }
      }

      for(var i = 0;i<this.players.length;i++){

        this.players[i].style.left = returnArr[i].x;
        this.players[i].style.top = returnArr[i].y
        
      }
    })

  }

}
