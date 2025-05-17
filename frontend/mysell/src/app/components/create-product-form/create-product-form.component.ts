import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from 'src/app/interfaces/product';
import { Category } from 'src/app/interfaces/category';
import { CATEGORIES } from 'src/app/datas/categories';
import { MEASURES } from 'src/app/datas/measures';
import { Measure } from 'src/app/interfaces/measure';

@Component({
  selector: 'app-create-product-form',
  templateUrl: './create-product-form.component.html',
  styleUrls: ['./create-product-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CreateProductFormComponent implements OnInit {
  ngOnInit(): void {
    console.log('CreateProductFormComponent initialized');
    console.log('Selected products:', this.selectedProducts);
  }
  // Inputs
  @Input() showModal: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Input() selectedProducts: Product[] = [];
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

  selectMeasure(measure: Measure): void {
    this.measureSearch = measure.unitOfMeasure;
    this.product.measure = measure;
    this.showMeasureDropdown = false;
  }

  hideMeasureDropdown(): void {
    setTimeout(() => (this.showMeasureDropdown = false), 200);
  }

  // Modal methods
  closeModal(): void {
    console.log('Modal closed');
    console.log('Selected products:', this.selectedProducts);
    this.closeModalEvent.emit();
  }

  confirmProduct(): void {
    console.log('Product added:', this.product);
    this.closeModal();
  }
}
