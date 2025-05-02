import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-product-form',
  templateUrl: './create-product-form.component.html',
  styleUrls: ['./create-product-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CreateProductFormComponent {
  showModal = true;
  product = {
    name: '',
    category: '',
    purchasePrice: '',
    sellingPrice: '',
    brand: '',
    measure: '',
  };

  closeModal() {
    this.showModal = false;
  }

  confirmProduct() {
    console.log('Product added:', this.product);
    this.closeModal();
  }
}
