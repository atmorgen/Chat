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

  ngOnInit() {
    document.getElementById('gameMode').style.display = 'none';
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

    if(this.player == undefined){
      this.glc.appendComponentToBody(PlayerComponent,'gameMode')
      this.player = document.getElementById('player')
    }

    const rngWidth = Math.floor((Math.random() * width) + 1);
    const rngHeight = Math.floor((Math.random() * height) + 1);

    this.player.style.left = rngWidth + 'px';
    this.player.style.top = rngHeight + 'px';

    this.inGame = true;
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
  
  postData(x,y){

    let output = JSON.parse(`
      {
        "player":"${JSON.parse(localStorage.getItem('userInfo')).user}",
        "x":"${x}",
        "y":"${y}"
      }    
    `)

      console.log(output)
  }

}
