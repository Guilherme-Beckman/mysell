import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-bottom-edit-pen',
  templateUrl: './bottom-edit-pen.component.html',
  styleUrls: ['./bottom-edit-pen.component.scss'],
  imports: [CommonModule],
})
export class BottomEditPenComponent implements OnInit {
  @Input() direction: 'right' | 'left' = 'right';
  @Output() arrowClick = new EventEmitter<void>();
  @Input() pageToGo: string = '';
  constructor(private navController: NavController) {}

  ngOnInit() {}

  onClick() {
    this.navController.navigateRoot(this.pageToGo);
  }
}
