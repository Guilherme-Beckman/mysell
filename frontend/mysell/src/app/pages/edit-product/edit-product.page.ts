import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Product } from 'src/app/interfaces/product';
import { NavController } from '@ionic/angular/standalone';
import { ProductSelectionService } from 'src/app/services/product-selection.service';
import { ActivatedRoute } from '@angular/router';
import { EditProductFormComponent } from 'src/app/components/edit-product-form/edit-product-form.component';
import { HomeRedirectComponent } from 'src/app/components/home-redirect/home-redirect.component';
import { BottomArrowComponent } from 'src/app/components/bottom-arrow/bottom-arrow.component';
import { ProguessBarComponent } from 'src/app/components/proguess-bar/proguess-bar.component';
import { ConfirmPopUpComponent } from 'src/app/components/confirm-pop-up/confirm-pop-up.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EditProductFormComponent,
    HomeRedirectComponent,
    BottomArrowComponent,
    ProguessBarComponent,
    ConfirmPopUpComponent,
    CommonModule,
  ],
})
export class EditProductPage implements OnInit {
  isDeleteConfirmationActive = false;
  isNavigateBackConfirmationActive = false;
  selectedProducts: Product[] = [];
  productIdToDelete = '';
  targetProgress = 50;
  currentProgress = 2;
  isNavigateHomeConfirmationActive = false;

  constructor(
    private navController: NavController,
    private originalProductSelection: ProductSelectionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initializeSelectedProducts();
  }

  private initializeSelectedProducts() {
    const initialProducts = this.originalProductSelection
      .getSelectedProducts()
      .map((product) => ({ ...product, product: { ...product } }));
    this.selectedProducts = initialProducts;
  }

  public showNavigateBackConfirmation() {
    this.isNavigateBackConfirmationActive = true;
  }

  public hideNavigateBackConfirmation() {
    this.isNavigateBackConfirmationActive = false;
  }

  public navigateToCreateProducts() {
    this.navController.navigateRoot('/create-products');
  }

  public confirmNavigationBack() {
    this.navigateToCreateProducts();
  }

  public navigateToSelectedProducts() {
    this.navController.navigateRoot('/selected-products');
  }

  public confirmProductDeletion() {
    this.originalProductSelection.removeProductById(this.productIdToDelete);
    this.selectedProducts = this.originalProductSelection.getSelectedProducts();

    if (this.selectedProducts.length === 0) {
      this.navigateToCreateProducts();
    }
  }
  public showNavigateHomeConfirmation() {
    this.isNavigateHomeConfirmationActive = true;
  }

  public hideNavigateHomeConfirmation() {
    this.isNavigateHomeConfirmationActive = false;
  }
  public confirmNavigationHome() {
    this.navController.navigateRoot('/home');
  }

  public trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
