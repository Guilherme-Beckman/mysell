import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {
    if (!this.products.length) {
      // Default products if none provided
      this.products = [
        { id: 1, name: 'Arroz', price: 50.0, selected: true, type: 'food' },
        { id: 2, name: 'Skai', price: 50.0, selected: false, type: 'drink' },
        { id: 3, name: 'Skai', price: 50.0, selected: false, type: 'drink' },
        { id: 4, name: 'Skai', price: 50.0, selected: false, type: 'drink' },
        { id: 5, name: 'Skai', price: 50.0, selected: false, type: 'drink' },
        { id: 6, name: 'Skai', price: 50.0, selected: false, type: 'drink' },
      ];
    }
  }

  toggleSelection(product: Product): void {
    product.selected = !product.selected;
  }

  formatCost(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }
}
