import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductSelectCount } from '../products-to-sell/products-to-sell.component';

@Component({
  selector: 'app-confirm-sell-pop-up',
  templateUrl: './confirm-sell-pop-up.component.html',
  styleUrls: ['./confirm-sell-pop-up.component.scss'],
  imports: [CommonModule],
})
export class ConfirmSellPopUpComponent implements OnInit {
  @Input() id: string = '';
  @Input() isActive: boolean = false;
  @Input() selectedProducts: ProductSelectCount[] = [];
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
  get totalPrice(): number {
    return this.selectedProducts.reduce((total, product) => {
      return total + product.product.sellingPrice * product.count;
    }, 0);
  }
}
