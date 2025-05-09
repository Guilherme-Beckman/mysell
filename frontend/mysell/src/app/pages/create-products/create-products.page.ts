import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { NavController } from '@ionic/angular';
import { ProductSelectionService } from 'src/app/services/product-selection.service';

@Component({
  selector: 'app-create-products',
  templateUrl: './create-products.page.html',
  styleUrls: ['./create-products.page.scss'],
  standalone: true,
  imports: [
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
  public hasAnyItemSelected = false;
  public showCreateForm: boolean = false;
  public selectedProducts: Product[] = [];
  constructor(
    private navController: NavController,
    private productSelection: ProductSelectionService
  ) {}
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
  public redirectToSelectedProducts() {
    this.productSelection.setSelectedProducts(this.selectedProducts);
    console.log('redirectToSelectedProducts: ' + this.selectedProducts);
    this.navController.navigateRoot('/edit-available-products');
  }
  public closeCreateFrom() {
    this.showCreateForm = false;
  }
  public getSelectedProducts($event: ProductSelect[]) {
    const products = $event.map((item) => item.product);
    console.log('getSelectedProducts', products);
    this.selectedProducts.push(...products);
  }
}
