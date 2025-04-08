import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-sppiner',
  templateUrl: './loading-sppiner.component.html',
  styleUrls: ['./loading-sppiner.component.scss'],
  imports: [CommonModule]
})
export class LoadingSppinerComponent  implements OnInit {
  @Input() isLoading: boolean = false;  
  constructor() { }

  ngOnInit() {}

}
