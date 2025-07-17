import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class EditProductSelectionServiceService {
  constructor() {}
  private _selectedProducts: Product[] = [];

  setSelectedProducts(products: Product[]) {
    this._selectedProducts = products;
  }

  getSelectedProducts(): Product[] {
    console.log(
      'ProductSelectionService.getSelectedProducts called, returning:',
      this._selectedProducts
    );
    return this._selectedProducts;
  }

  clear() {
    this._selectedProducts = [];
  }
  removeProductById(productId: string) {
    this._selectedProducts = this._selectedProducts.filter(
      (product) => product.id !== productId
    );
  }
}
