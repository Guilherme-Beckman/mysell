import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-bottom-trashcan',
  templateUrl: './bottom-trashcan.component.html',
  styleUrls: ['./bottom-trashcan.component.scss'],
  imports: [CommonModule],
})
export class BottomTrashcanComponent implements OnInit {
  @Input() direction: 'right' | 'left' = 'right';
  @Output() arrowClick = new EventEmitter<void>();

  constructor(private navController: NavController) {}

  ngOnInit() {}

  onClick() {
    this.arrowClick.emit();
  }
}
