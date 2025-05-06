import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-button',
  templateUrl: './confirm-button.component.html',
  styleUrls: ['./confirm-button.component.scss'],
  imports: [CommonModule],
})
export class ConfirmButtonComponent implements OnInit {
  @Input() position: 'right' | 'left' = 'right'; // era "direction"
  @Output() confirm = new EventEmitter<void>(); // era "arrowClick"

  constructor(private navController: NavController) {}

  ngOnInit() {}

  onConfirmClick() {
    // era "onClick"
    this.confirm.emit();
  }
}
