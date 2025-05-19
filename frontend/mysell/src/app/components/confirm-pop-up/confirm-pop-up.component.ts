import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-pop-up',
  templateUrl: './confirm-pop-up.component.html',
  styleUrls: ['./confirm-pop-up.component.scss'],
  imports: [CommonModule],
})
export class ConfirmPopUpComponent implements OnInit {
  @Input() id: string = '';
  @Input() isActive: boolean = false;
  @Input() firstMessage: string = '';
  @Input() secondMessage: string = '';
  @Output() confirm = new EventEmitter<string>();
  @Output() closeButtonEvent = new EventEmitter<void>();
  constructor() {}

  ngOnInit() {}

  public closePopUpButton() {
    console.log('closeButton');
    this.closeButtonEvent.emit();
  }
  public confirmButton() {
    console.log('confirmButton');
    this.confirm.emit(this.id);
    this.closePopUpButton();
  }
}
