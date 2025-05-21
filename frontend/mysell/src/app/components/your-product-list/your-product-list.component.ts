import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductSelect } from '../available-products/available-products.component';
import { getCategoryIconPath } from 'src/app/datas/categories';
import { AVAIABLE_PRODUCTS } from 'src/app/datas/availlable-products';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/interfaces/product';

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

  public filteredProducts: ProductSelect[] = [];
  constructor(private productService: ProductService) {}
  ngOnInit() {
    this.productService.getMyProducts().subscribe({
      next: (products) => {
        this.filteredProducts = products.map((product) => ({
          product,
          selected: false,
        }));
      },
      error: (err) => {
        console.error('Erro ao buscar produtos:', err);
      },
    });
  }

  toggleSelection(product: any): void {}
  formatCost(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }
  public getIconPath(categoryName: string) {
    return getCategoryIconPath(categoryName);
  }
}
