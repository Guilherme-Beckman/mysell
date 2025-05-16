import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
import { HomeRedirectComponent } from 'src/app/components/home-redirect/home-redirect.component';
import { ProguessBarComponent } from 'src/app/components/proguess-bar/proguess-bar.component';
import { BottomArrowComponent } from 'src/app/components/bottom-arrow/bottom-arrow.component';
import { ConfirmButtonComponent } from 'src/app/components/confirm-button/confirm-button.component';
import { ProductSelect } from 'src/app/components/available-products/available-products.component';
import { ProductSelectionService } from 'src/app/services/product-selection.service';
import { Product } from 'src/app/interfaces/product';
import { getCategoryIconPath } from 'src/app/datas/categories';
import { ConfirmPopUpComponent } from 'src/app/components/confirm-pop-up/confirm-pop-up.component';
import { EditedProductSelectionService } from 'src/app/services/edited-product-selection.service';

@Component({
  selector: 'app-selected-products',
  templateUrl: './selected-products.page.html',
  styleUrls: ['./selected-products.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HomeRedirectComponent,
    ProguessBarComponent,
    BottomArrowComponent,
    ConfirmButtonComponent,
    ConfirmPopUpComponent,
  ],
})
export class SelectedProductsPage implements OnInit {
  public selectedProducts: Product[] = [];
  public isConfirmationPopupActive = false;
  public productIdToExclude = '';
  public maxProgress = 100;
  public currentProgressValue = 50;
  public isNavigateHomeConfirmationActive = false;

  constructor(
    private navController: NavController,
    private editedProductSelectionService: EditedProductSelectionService
  ) {}

  ngOnInit() {
    this.selectedProducts =
      this.editedProductSelectionService.getSelectedProducts();
    this.animateProgressBar();
  }

  public openProductExclusionConfirmation(productId: string): void {
    this.productIdToExclude = productId;
    this.isConfirmationPopupActive = true;
  }

  public handleProductExclusionConfirmation(): void {
    this.editedProductSelectionService.removeProductById(
      this.productIdToExclude
    );
    this.selectedProducts =
      this.editedProductSelectionService.getSelectedProducts();

    if (!this.selectedProducts.length) {
      this.navigateToRoot();
    }
  }

  public closeConfirmationPopup(): void {
    this.isConfirmationPopupActive = false;
  }

  public navigateBack(): void {
    this.navController.navigateRoot(['/edit-available-products'], {
      queryParams: { progress: this.currentProgressValue },
    });
  }

  public getCategoryIconUrl(categoryName: string) {
    return getCategoryIconPath(categoryName);
  }

  public navigateToRoot(): void {
    this.navController.navigateRoot('/create-products');
  }

  public trackProductById(index: number, product: Product): string {
    return product.id;
  }

  private animateProgressBar(): void {
    const progressInterval = setInterval(() => {
      if (this.currentProgressValue < this.maxProgress) {
        this.currentProgressValue++;
      } else {
        clearInterval(progressInterval);
      }
    }, 5);
  }
  public showNavigateHomeConfirmation() {
    this.isNavigateHomeConfirmationActive = true;
  }

  public hideNavigateHomeConfirmation() {
    this.isNavigateHomeConfirmationActive = false;
  }
  public confirmNavigationHome() {
    this.editedProductSelectionService.clear();
    this.navController.navigateRoot('/home');
  }
}
