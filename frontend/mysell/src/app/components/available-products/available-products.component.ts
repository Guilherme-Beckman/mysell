import { CommonModule } from '@angular/common';
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
  @Input() searchTerm: string = '';
  @Output() hasAnyItemSelected = new EventEmitter<boolean>();
  @Output() selectedProducts = new EventEmitter<ProductSelect[]>();

  filteredProducts: ProductSelect[] = [];
  allProducts: ProductSelect[] = [];

  constructor(private productSelectionService: ProductSelectionService) {}

  ngOnInit(): void {
    if (!this.products.length) {
      this.allProducts = AVAIABLE_PRODUCTS;
    } else {
      this.allProducts = this.products;
    }

    if (this.productSelectionService.getSelectedProducts().length === 0) {
      this.allProducts.forEach((product) => (product.selected = false));
    }

    this.filteredProducts = [...this.allProducts];
  }

  ngOnChanges() {
    this.filterProducts();
  }

  filterProducts(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredProducts = [...this.allProducts];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredProducts = this.allProducts.filter(
      (item) =>
        item.product.name.toLowerCase().includes(term) ||
        item.product.brand.toLowerCase().includes(term) ||
        item.product.category.toLowerCase().includes(term)
    );
  }

  public getIconPath(categoryName: string) {
    return getCategoryIconPath(categoryName);
  }

  toggleSelection(product: ProductSelect): void {
    product.selected = !product.selected;

    if (product.selected) {
      const current = this.productSelectionService.getSelectedProducts();
      const alreadyExists = current.some((p) => p.id === product.product.id);
      if (!alreadyExists) {
        this.productSelectionService.setSelectedProducts([
          ...current,
          product.product,
        ]);
      }
    } else {
      this.productSelectionService.removeProductById(product.product.id);
    }

    this.emmitCurrentSelectionState();
    this.sendAllSelectedProducts();
  }

  private emmitCurrentSelectionState() {
    const hasAny = this.allProducts.some((product) => product.selected);
    this.hasAnyItemSelected.emit(hasAny);
  }

  sendAllSelectedProducts() {
    const selectedProducts = this.getSelectedProducts();
    this.selectedProducts.emit(selectedProducts);
  }

  private getSelectedProducts(): ProductSelect[] {
    return this.allProducts.filter((product) => product.selected);
  }

  formatCost(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }
}
