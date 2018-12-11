import { Component, OnInit, HostListener, ComponentFactoryResolver, 
  ApplicationRef, Injector } from '@angular/core';
import { GlobalJSONLibraryComponent } from '../global-jsonlibrary/global-jsonlibrary.component'
import { PlayerComponent } from './player/player.component'

@Component({
  selector: 'app-shooter',
  templateUrl: './shooter.component.html',
  styleUrls: ['./shooter.component.css'],
  entryComponents:[PlayerComponent]
})
export class ShooterComponent implements OnInit {

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef, private injector: Injector) { }

  glc:GlobalJSONLibraryComponent = new GlobalJSONLibraryComponent(this.componentFactoryResolver,this.appRef,this.injector)

  ngOnInit() {
    document.getElementById('gameMode').style.display = 'none';
  }

  x;
  y;

  @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {
      this.x = event.layerX
      this.y = event.layerY
    }

  @HostListener('mousedown', ['$event'])
    onmousedown(e){
      //console.log(e)
      //console.log('x: ' + this.x)
      //console.log('y: ' + this.y)
    }
  
  player;
  joinGame(){
    this.glc.appendComponentToBody(PlayerComponent,'gameMode')
    this.player = document.getElementById('player')

    const width = document.getElementById('gameMode').offsetWidth
    const height = document.getElementById('gameMode').offsetHeight

    const rngWidth = Math.floor((Math.random() * width) + 1);
    const rngHeight = Math.floor((Math.random() * height) + 1);

    this.player.style.left = width + 'px';
    console.log(rngWidth)
  }
  
  

}
