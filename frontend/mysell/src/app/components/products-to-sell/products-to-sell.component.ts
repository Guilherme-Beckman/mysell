import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getCategoryIconPath } from 'src/app/datas/categories';
import { ProductService } from 'src/app/services/product.service';
import { ProductSelect } from '../available-products/available-products.component';
import { IonSkeletonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { CounterComponent } from '../counter/counter.component';

@Component({
  selector: 'app-products-to-sell',
  templateUrl: './products-to-sell.component.html',
  styleUrls: ['./products-to-sell.component.scss'],
  imports: [CommonModule, IonSkeletonText, CounterComponent],
})
export class ProductsToSellComponent implements OnInit {
  @Input() searchTerm: string = '';
  @Output() hasAnyItemSelected = new EventEmitter<boolean>();

  public isLoading = false;

  @Output() selectedProducts = new EventEmitter<ProductSelect[]>();
  allProducts: ProductSelect[] = [];

  public filteredProducts: ProductSelect[] = [];
  constructor(private productService: ProductService) {}
  ngOnInit() {
    this.isLoading = true;
    this.productService.getMyProducts().subscribe({
      next: (products) => {
        const mappedProducts = products.map((product) => ({
          product,
          selected: false,
        }));
        this.filteredProducts = mappedProducts;
        this.allProducts = mappedProducts;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar produtos:', err);
        this.isLoading = false;
      },
    });
  }

  ngOnChanges() {
    this.filterProducts();
  }

  filterProducts(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredProducts = [...this.allProducts];
      return;
    }

    const term = this.normalizeText(this.searchTerm.toLowerCase().trim());
    this.filteredProducts = this.allProducts.filter(
      (item) =>
        this.normalizeText(item.product.name.toLowerCase()).includes(term) ||
        this.normalizeText(item.product.brand.toLowerCase()).includes(term) ||
        this.normalizeText(item.product.category.toLowerCase()).includes(term)
    );
  }
  normalizeText(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
  public reloadProducts() {
    this.isLoading = true;

    this.productService.getMyProducts().subscribe({
      next: (products) => {
        const mappedProducts = products.map((product) => ({
          product,
          selected: false,
        }));
        this.filteredProducts = mappedProducts;
        this.allProducts = mappedProducts;

        // Limpa qualquer seleção anterior
        this.emmitCurrentSelectionState();
        this.sendAllSelectedProducts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao recarregar produtos:', err);
        this.isLoading = false;
      },
    });
  }
}
