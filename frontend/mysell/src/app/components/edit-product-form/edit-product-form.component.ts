import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { CATEGORIES } from 'src/app/datas/categories';
import { MEASURES } from 'src/app/datas/measures';
import { Category } from 'src/app/interfaces/category';
import { Measure } from 'src/app/interfaces/measure';
import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-edit-product-form',
  templateUrl: './edit-product-form.component.html',
  styleUrls: ['./edit-product-form.component.scss'],
  imports: [CommonModule, FormsModule, NgxMaskDirective],
})
export class EditProductFormComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('edit produtc info:' + this.productInfo);
    this.measureSearch = this.productInfo.measure.unitOfMeasure;
    this.categorySearch = this.productInfo.category;
  }
  // Inputs
  @Input() showModal: boolean = false;
  @Input() productInfo!: Product;
  @Output() closeModalEvent = new EventEmitter<void>();
  // Product model
  product: Product = {
    id: '',
    name: '',
    category: '',
    purchasePrice: 0,
    sellingPrice: 0,
    brand: '',
    measure: {
      quantity: 0,
      unitOfMeasure: '',
    },
  };

  // Category dropdown state
  categorySearch = '';
  filteredCategories: Category[] = [];
  showDropdown = false;

  // Measure dropdown state
  measureSearch = '';
  filteredMeasures: string[] = [];
  showMeasureDropdown = false;

  // Static data
  categories = CATEGORIES;

  measures = MEASURES;

  // Category methods
  filterCategories(): void {
    const term = this.categorySearch.toLowerCase();
    this.filteredCategories = this.categories.filter((cat) =>
      cat.name.toLowerCase().includes(term)
    );
  }

  selectCategory(category: Category): void {
    this.categorySearch = category.name;
    this.product.category = category.name;
    this.showDropdown = false;
  }

  hideDropdown(): void {
    setTimeout(() => (this.showDropdown = false), 200);
  }

  // Measure methods
  filterMeasures(): void {
    const term = this.measureSearch.toLowerCase();
    this.filteredMeasures = this.measures.filter((m) =>
      m.toLowerCase().includes(term)
    );
  }

  selectMeasure(measure: string): void {
    this.measureSearch = measure;
    this.product.measure.unitOfMeasure = measure;
    this.showMeasureDropdown = false;
  }

  hideMeasureDropdown(): void {
    setTimeout(() => (this.showMeasureDropdown = false), 200);
  }

  // Modal methods
  closeModal(): void {
    console.log('Modal closed');
    this.closeModalEvent.emit();
  }

  confirmProduct(): void {
    console.log('Product added:', this.product);
    this.closeModal();
  }
  get purchasePriceModel(): string | number {
    return this.product.purchasePrice === 0 ? '' : this.product.purchasePrice;
  }

  get sellingPriceModel(): string | number {
    return this.product.sellingPrice === 0 ? '' : this.product.sellingPrice;
  }

  onPurchasePriceChange(value: string): void {
    this.product.purchasePrice = this.parseMaskedPrice(value);
  }

  onSellingPriceChange(value: string): void {
    this.product.sellingPrice = this.parseMaskedPrice(value);
  }

  private parseMaskedPrice(value: string): number {
    if (!value) return 0;
    // Remove "R$ ", ".", substitui "," por "." para parsear corretamente
    const cleaned = value.replace(/[R$\s.]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  get quantityModel(): string | number {
    return this.product.measure.quantity === 0
      ? ''
      : this.product.measure.quantity;
  }

  onQuantityChange(value: string): void {
    this.product.measure.quantity = this.parseMaskedQuantity(value);
  }

  private parseMaskedQuantity(value: string): number {
    if (!value) return 0;
    const cleaned = value.replace(',', '.'); // Suporte para vírgula como separador decimal
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
}
