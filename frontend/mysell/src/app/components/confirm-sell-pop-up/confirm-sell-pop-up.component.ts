import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-sell-pop-up',
  templateUrl: './confirm-sell-pop-up.component.html',
  styleUrls: ['./confirm-sell-pop-up.component.scss'],
  imports: [CommonModule],
})
export class ConfirmSellPopUpComponent implements OnInit {
  @Input() id: string = '';
  @Input() isActive: boolean = false;
  @Input() firstMessage: string = '';
  @Input() secondMessage: string = '';
  @Output() confirm = new EventEmitter<string>();
  @Output() closeButtonEvent = new EventEmitter<void>();
  constructor() {}

  ngOnInit() {}

  public closePopUpButton() {
    this.closeButtonEvent.emit();
  }
  public confirmButton() {
    this.confirm.emit(this.id);
    this.closePopUpButton();
  }
}
