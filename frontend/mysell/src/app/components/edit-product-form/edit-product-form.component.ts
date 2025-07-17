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
    this.measureSearch = this.productInfo.measure.unitOfMeasure;
    this.categorySearch = this.productInfo.category;
  }

  // Inputs
  @Input() showModal: boolean = false;
  @Input() productInfo!: Product;
  @Output() closeModalEvent = new EventEmitter<void>();

  // Product model

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
    this.productInfo.category = category.name;
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
    this.productInfo.measure.unitOfMeasure = measure;
    this.showMeasureDropdown = false;
  }

  hideMeasureDropdown(): void {
    setTimeout(() => (this.showMeasureDropdown = false), 200);
  }

  // Modal methods
  closeModal(): void {
    this.closeModalEvent.emit();
  }

  confirmProduct(): void {
    this.closeModal();
  }

  get purchasePriceModel(): string | number {
    return this.productInfo.purchasePrice === 0
      ? ''
      : this.productInfo.purchasePrice;
  }

  get sellingPriceModel(): string | number {
    return this.productInfo.sellingPrice === 0
      ? ''
      : this.productInfo.sellingPrice;
  }

  onPurchasePriceChange(value: string): void {
    this.productInfo.purchasePrice = this.parseMaskedPrice(value);
  }

  onSellingPriceChange(value: string): void {
    this.productInfo.sellingPrice = this.parseMaskedPrice(value);
  }

  private parseMaskedPrice(value: string): number {
    if (!value) return 0;
    const cleaned = value.replace(/[R$\s.]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  get quantityModel(): string | number {
    const quantity = this.productInfo.measure.quantity;
    return quantity === 0 ? '' : quantity;
  }

  onQuantityChange(value: string): void {
    const parsedQuantity = this.parseMaskedQuantity(value);
    this.productInfo.measure.quantity = parsedQuantity;
  }

  private parseMaskedQuantity(value: string): number {
    if (!value) return 0;
    const cleaned = value.replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
}
