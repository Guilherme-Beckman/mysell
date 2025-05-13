import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import { EditProductFormComponent } from 'src/app/components/edit-product-form/edit-product-form.component';
import { HomeRedirectComponent } from 'src/app/components/home-redirect/home-redirect.component';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
import { BottomArrowComponent } from 'src/app/components/bottom-arrow/bottom-arrow.component';
import { ProguessBarComponent } from 'src/app/components/proguess-bar/proguess-bar.component';
import { ConfirmPopUpComponent } from 'src/app/components/confirm-pop-up/confirm-pop-up.component';
import { Product } from 'src/app/interfaces/product';
import { ProductSelectionService } from 'src/app/services/product-selection.service';
import { Route, Router } from '@angular/router';
import { EditedProductSelectionService } from 'src/app/services/edited-product-selection.service';

@Component({
  selector: 'app-edit-available-products',
  templateUrl: './edit-available-products.page.html',
  styleUrls: ['./edit-available-products.page.scss'],
  standalone: true,
  imports: [
    EditProductFormComponent,
    HomeRedirectComponent,
    ArrowComponent,
    BottomArrowComponent,
    ProguessBarComponent,
    ConfirmPopUpComponent,
    CommonModule,
  ],
})
export class EditAvailableProductsPage implements OnInit {
  public isConfirmPopUpAtive: boolean = false;
  public isConfirmPopUpAtiveNavigateBack: boolean = false;

  public selectedProducts: Product[] = [];
  public productExclusionId: string = '';
  constructor(
    private navController: NavController,
    private router: Router,
    private productSelection: ProductSelectionService,
    private editedProductSelection: EditedProductSelectionService
  ) {}

  ngOnInit() {
    this.selectedProducts = this.productSelection
      .getSelectedProducts()
      .map((product) => ({
        ...product,
        product: { ...product },
      }));
    console.log('ngOnInit: ' + this.selectedProducts);
  }
  proguess() {
    return 50;
  }
  public openConfirmPopUp(productId: string) {
    console.log('openConfirmPopUp');
    this.productExclusionId = productId;
    this.isConfirmPopUpAtive = true;
  }
  public openConfirmPopUpNavigateBack() {
    this.isConfirmPopUpAtiveNavigateBack = true;
  }
  public closeConfirmPopUp() {
    console.log('closeConfirmPopUp');
    this.isConfirmPopUpAtive = false;
  }
  public closeConfirmPopUpNavigateBack() {
    console.log('closeConfirmPopUp');
    this.isConfirmPopUpAtiveNavigateBack = false;
  }
  public redirectBack() {
    this.navController.navigateRoot('/create-products');
  }
  public confirmNavigateBack() {
    this.redirectBack();
  }
  public redirectFront() {
    this.editedProductSelection.setSelectedProducts(this.selectedProducts);
    this.navController.navigateRoot('/selected-products');
  }
  public confirmProductExclusion() {
    this.productSelection.removeProductById(this.productExclusionId);
    this.editedProductSelection.removeProductById(this.productExclusionId);
    this.selectedProducts = this.productSelection.getSelectedProducts();
    if (!this.selectedProducts || this.selectedProducts.length === 0) {
      this.redirectBack();
    }
  }

  public trackByProductId(index: number, item: Product): string {
    return item.id;
  }
}
