import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonNav,
} from '@ionic/angular/standalone';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
import { HomeRedirectComponent } from 'src/app/components/home-redirect/home-redirect.component';
import { ProguessBarComponent } from 'src/app/components/proguess-bar/proguess-bar.component';
import { SearchBarComponent } from 'src/app/components/search-bar/search-bar.component';
import {
  AddProductButton,
  AddProductButtonsComponent,
} from 'src/app/components/add-product-buttons/add-product-buttons.component';
import {
  AvailableProductsComponent,
  ProductSelect,
} from 'src/app/components/available-products/available-products.component';
import { BottomArrowComponent } from 'src/app/components/bottom-arrow/bottom-arrow.component';
import { CreateProductFormComponent } from 'src/app/components/create-product-form/create-product-form.component';
import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-create-products',
  templateUrl: './create-products.page.html',
  styleUrls: ['./create-products.page.scss'],
  standalone: true,
  imports: [
    IonNav,
    CommonModule,
    FormsModule,
    ArrowComponent,
    HomeRedirectComponent,
    ProguessBarComponent,
    SearchBarComponent,
    AddProductButtonsComponent,
    AvailableProductsComponent,
    BottomArrowComponent,
    CreateProductFormComponent,
  ],
})
export class CreateProductsPage implements OnInit {
  public hasAnyItemSelected =
    localStorage.getItem('selectedProducts') === 'true';
  public showCreateForm: boolean = false;
  public selectedProducts: Product[] = [];
  constructor() {}
  buttons: AddProductButton[] = [
    {
      svgPath: '/assets/svg/add-product.svg',
      action: () => null,
    },
    {
      svgPath: '/assets/svg/barcode.svg',
      action: () => null,
    },
  ];

  ngOnInit() {}
  proguess() {
    return 50;
  }
  openCreateForm() {
    console.log('openCreateForm');
    this.showCreateForm = true;
  }
  closeCreateFrom() {
    console.log('closeCreateFrom');
    this.showCreateForm = false;
  }
  getSelectedProducts($event: ProductSelect[]) {
    const products = $event.map((item) => item.product);
    console.log('getSelectedProducts', products);
    this.selectedProducts.push(...products);
  }
}
