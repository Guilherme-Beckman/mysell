import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-proguess-bar',
  templateUrl: './proguess-bar.component.html',
  styleUrls: ['./proguess-bar.component.scss'],
})
export class ProguessBarComponent implements OnInit {
  @Input() progress = 0;
  constructor() {}
  clampedProgress(): number {
    return Math.max(0, Math.min(100, this.progress));
  }

  ngOnInit() {}
}
