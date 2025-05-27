import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

import { EditProductFormComponent } from 'src/app/components/edit-product-form/edit-product-form.component';
import { HomeRedirectComponent } from 'src/app/components/home-redirect/home-redirect.component';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
import { BottomArrowComponent } from 'src/app/components/bottom-arrow/bottom-arrow.component';
import { ProguessBarComponent } from 'src/app/components/proguess-bar/proguess-bar.component';
import { ConfirmPopUpComponent } from 'src/app/components/confirm-pop-up/confirm-pop-up.component';
import { Product } from 'src/app/interfaces/product';
import { ProductSelectionService } from 'src/app/services/product-selection.service';
import { EditedProductSelectionService } from 'src/app/services/edited-product-selection.service';

@Component({
  selector: 'app-edit-available-products',
  templateUrl: './edit-available-products.page.html',
  styleUrls: ['./edit-available-products.page.scss'],
  standalone: true,
  imports: [
    EditProductFormComponent,
    HomeRedirectComponent,
    BottomArrowComponent,
    ProguessBarComponent,
    ConfirmPopUpComponent,
    CommonModule,
  ],
})
export class EditAvailableProductsPage implements OnInit {
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
    private editedProductSelection: EditedProductSelectionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.initializeSelectedProducts();
    this.setupProgressAnimation();
  }

  private initializeSelectedProducts() {
    const storedProducts = this.editedProductSelection.getSelectedProducts();
    if (!storedProducts || storedProducts.length === 0) {
      const initialProducts = this.originalProductSelection
        .getSelectedProducts()
        .map((product) => ({ ...product, product: { ...product } }));
      this.editedProductSelection.setSelectedProducts(initialProducts);
      this.selectedProducts = initialProducts;
    } else {
      this.selectedProducts = storedProducts;
    }
  }

  private setupProgressAnimation() {
    this.route.queryParams.subscribe((params) => {
      const progressParam = parseInt(params['progress'], 10);
      this.currentProgress = isNaN(progressParam)
        ? this.currentProgress
        : progressParam;
    });
    this.animateProgress();
  }

  private animateProgress() {
    const animationInterval = setInterval(() => {
      if (this.currentProgress < this.targetProgress) {
        this.currentProgress++;
      } else if (this.currentProgress > this.targetProgress) {
        this.currentProgress--;
      } else {
        clearInterval(animationInterval);
      }
    }, 5);
  }

  public showDeleteConfirmation(productId: string) {
    this.productIdToDelete = productId;
    this.isDeleteConfirmationActive = true;
  }

  public showNavigateBackConfirmation() {
    this.isNavigateBackConfirmationActive = true;
  }

  public hideDeleteConfirmation() {
    this.isDeleteConfirmationActive = false;
  }

  public hideNavigateBackConfirmation() {
    this.isNavigateBackConfirmationActive = false;
  }

  public navigateToCreateProducts() {
    this.navController.navigateRoot('/create-products');
  }

  public confirmNavigationBack() {
    this.editedProductSelection.clear();
    this.navigateToCreateProducts();
  }

  public navigateToSelectedProducts() {
    this.editedProductSelection.setSelectedProducts(this.selectedProducts);
    this.navController.navigateRoot('/selected-products');
  }

  public confirmProductDeletion() {
    this.originalProductSelection.removeProductById(this.productIdToDelete);
    this.editedProductSelection.removeProductById(this.productIdToDelete);
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
    this.editedProductSelection.clear();
    this.navController.navigateRoot('/home');
  }

  public trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
