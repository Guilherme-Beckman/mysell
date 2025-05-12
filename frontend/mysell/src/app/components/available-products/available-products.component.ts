import { CommonModule } from '@angular/common';
import { C } from '@angular/common/common_module.d-Qx8B6pmN';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AVAIABLE_PRODUCTS } from 'src/app/datas/availlable-products';
import { getCategoryIconPath } from 'src/app/datas/categories';
import { Product } from 'src/app/interfaces/product';
import { ProductSelectionService } from 'src/app/services/product-selection.service';

export interface ProductSelect {
  product: Product;
  selected: boolean;
}

@Component({
  selector: 'app-available-products',
  templateUrl: './available-products.component.html',
  styleUrls: ['./available-products.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AvailableProductsComponent implements OnInit {
  @Input() products: ProductSelect[] = [];
  @Output() hasAnyItemSelected = new EventEmitter<boolean>();
  @Output() selectedProducts = new EventEmitter<ProductSelect[]>();
  constructor(private productSelectionService: ProductSelectionService) {}

  ngOnInit(): void {
    if (!this.products.length) {
      this.products = AVAIABLE_PRODUCTS;
    }
    if (this.productSelectionService.getSelectedProducts().length === 0) {
      this.products.forEach((product) => (product.selected = false));
    }
  }
  public getIconPath(categoryName: string) {
    return getCategoryIconPath(categoryName);
  }
  toggleSelection(product: ProductSelect): void {
    product.selected = !product.selected;
    this.emmitCurrentSelectionState();
    this.sendAllSelectedProducts();
  }
  private emmitCurrentSelectionState() {
    const hasAny = this.products.some((product) => product.selected);

    this.hasAnyItemSelected.emit(hasAny);
  }
  sendAllSelectedProducts() {
    const selectedProducts = this.getSelectedProducts();
    this.selectedProducts.emit(selectedProducts);
  }
  private getSelectedProducts(): ProductSelect[] {
    return this.products.filter((product) => product.selected);
  }
  formatCost(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }
}
