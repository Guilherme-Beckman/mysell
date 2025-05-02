import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  selected: boolean;
  type: 'food' | 'drink';
}

@Component({
  selector: 'app-available-products',
  templateUrl: './available-products.component.html',
  styleUrls: ['./available-products.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AvailableProductsComponent implements OnInit {
  @Input() products: Product[] = [];
  @Output() hasAnyItemSelected = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {
    if (!this.products.length) {
      // Default products if none provided
      this.products = [
        { id: 1, name: 'Arroz', price: 50.0, selected: false, type: 'food' },
        { id: 2, name: 'Skai', price: 50.0, selected: false, type: 'food' },
        { id: 3, name: 'Skai', price: 50.0, selected: false, type: 'food' },
        { id: 4, name: 'Skai', price: 50.0, selected: false, type: 'food' },
        { id: 5, name: 'Skai', price: 50.0, selected: false, type: 'food' },
        { id: 6, name: 'Skai', price: 50.0, selected: false, type: 'food' },
      ];
    }
  }

  toggleSelection(product: Product): void {
    product.selected = !product.selected;
    this.emmitCurrentSelectionState();
  }
  private emmitCurrentSelectionState() {
    const hasAny = this.products.some((product) => product.selected);
    if (hasAny) {
      localStorage.setItem('selectedProducts', 'true');
    } else {
      localStorage.removeItem('selectedProducts');
    }
    this.hasAnyItemSelected.emit(hasAny);
  }
  formatCost(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }
}
