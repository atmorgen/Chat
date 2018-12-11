import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.css']
})
export class MusicPlayerComponent implements OnInit {

  constructor() { }

  collapsePlayer() {
    document.getElementById('musicArtwork').classList.toggle('hidden');
    document.getElementById('downArrow').classList.toggle('hidden');
    document.getElementById('upArrow').classList.toggle('hidden');
  }

  ngOnInit() {
  }

}
