import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductSelect } from '../available-products/available-products.component';
import { getCategoryIconPath } from 'src/app/datas/categories';
import { AVAIABLE_PRODUCTS } from 'src/app/datas/availlable-products';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/interfaces/product';
import { BottomTrashcanComponent } from '../bottom-trashcan/bottom-trashcan.component';

@Component({
  selector: 'app-your-product-list',
  templateUrl: './your-product-list.component.html',
  styleUrls: ['./your-product-list.component.scss'],
  imports: [CommonModule],
})
export class YourProductListComponent implements OnInit {
  @Input() searchTerm: string = '';
  @Output() hasAnyItemSelected = new EventEmitter<boolean>();
  @Output() selectedProducts = new EventEmitter<ProductSelect[]>();
  allProducts: ProductSelect[] = [];

  public filteredProducts: ProductSelect[] = [];
  constructor(private productService: ProductService) {}
  ngOnInit() {
    this.productService.getMyProducts().subscribe({
      next: (products) => {
        const mappedProducts = products.map((product) => ({
          product,
          selected: false,
        }));
        this.filteredProducts = mappedProducts;
        this.allProducts = mappedProducts;
      },
      error: (err) => {
        console.error('Erro ao buscar produtos:', err);
      },
    });
  }

  toggleSelection(product: ProductSelect): void {
    product.selected = !product.selected;

    this.emmitCurrentSelectionState();
    this.sendAllSelectedProducts();
  }
  formatCost(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }
  public getIconPath(categoryName: string) {
    return getCategoryIconPath(categoryName);
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
}
