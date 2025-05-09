import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ProductSelectionService {
  constructor() {}
  private _selectedProducts: Product[] = [];

  setSelectedProducts(products: Product[]) {
    this._selectedProducts = products;
  }

  getSelectedProducts(): Product[] {
    return this._selectedProducts;
  }

  clear() {
    this._selectedProducts = [];
  }
}
