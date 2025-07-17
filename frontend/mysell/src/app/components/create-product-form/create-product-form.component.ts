import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from 'src/app/interfaces/product';
import { Category } from 'src/app/interfaces/category';
import { CATEGORIES } from 'src/app/datas/categories';
import { MEASURES } from 'src/app/datas/measures';
import { Measure } from 'src/app/interfaces/measure';
import { NgxMaskApplierService } from 'ngx-mask/lib/ngx-mask-applier.service';
import { NgxMaskDirective, NgxMaskService } from 'ngx-mask';

@Component({
  selector: 'app-create-product-form',
  templateUrl: './create-product-form.component.html',
  styleUrls: ['./create-product-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
})
export class CreateProductFormComponent implements OnInit, OnChanges {
  ngOnInit(): void {
    console.log('CreateProductFormComponent initialized');
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && changes['product'].currentValue) {
      this.categorySearch = this.product.category || '';
      this.measureSearch = this.product.measure.unitOfMeasure || '';
    }
  }

  // Inputs
  @Input() showModal: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() confirmCreateProductEvent = new EventEmitter<Product>();
  @Input() product: Product = {
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
    this.product = {
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
    this.closeModalEvent.emit();
  }

  confirmProduct(): void {
    const { name, purchasePrice, sellingPrice } = this.product;

    if (!name.trim()) {
      alert('O nome do produto não pode ser vazio.');
      return;
    }

    if (
      purchasePrice == null ||
      sellingPrice == null ||
      isNaN(purchasePrice) ||
      isNaN(sellingPrice)
    ) {
      alert('Os preços devem ser informados corretamente.');
      return;
    }

    if (sellingPrice < purchasePrice) {
      alert('O preço de venda não pode ser menor que o preço de compra.');
      return;
    }

    console.log('Product added:', this.product);
    this.confirmCreateProductEvent.emit(this.product);
    this.closeModal();
  }

  get purchasePriceModel(): string | number {
    return this.product.purchasePrice === 0 ? '' : this.product.purchasePrice;
  }

  get sellingPriceModel(): string | number {
    return this.product.sellingPrice === 0 ? '' : this.product.sellingPrice;
  }

  private parseMaskedPrice(value: any): number {
    if (!value) return 0;
    const strValue = String(value);
    const cleaned = strValue.replace(/[R$\s.]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  onPurchasePriceChange(value: any): void {
    this.product.purchasePrice = this.parseMaskedPrice(value);
  }

  onSellingPriceChange(value: any): void {
    this.product.sellingPrice = this.parseMaskedPrice(value);
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
