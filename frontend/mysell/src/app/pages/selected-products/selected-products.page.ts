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
    ArrowComponent,
    HomeRedirectComponent,
    ProguessBarComponent,
    BottomArrowComponent,
    ConfirmButtonComponent,
    ConfirmPopUpComponent,
  ],
})
export class SelectedProductsPage implements OnInit {
  public products: Product[] = [];
  public isConfirmPopUpAtive: boolean = false;
  public productExclusionId: string = '';

  openConfirmPopUp(productId: string) {
    this.productExclusionId = productId;
    this.isConfirmPopUpAtive = true;
  }

  proguess() {
    return 50;
  }
  constructor(
    private navController: NavController,
    private productSelection: EditedProductSelectionService
  ) {}
  public confirmProductExclusion() {
    this.productSelection.removeProductById(this.productExclusionId);
    this.products = this.productSelection.getSelectedProducts();
    if (!this.products || this.products.length === 0) {
      this.redirectRoot();
    }
  }
  public closeConfirmPopUp() {
    console.log('closeConfirmPopUp');
    this.isConfirmPopUpAtive = false;
  }

  ngOnInit() {
    this.products = this.productSelection.getSelectedProducts();
  }
  trackById(index: number, item: Product) {
    return item.id;
  }
  public redirectBack() {
    this.navController.navigateRoot('/edit-available-products');
  }
  public getIconUrl(categoryName: string) {
    return getCategoryIconPath(categoryName);
  }
  public redirectRoot() {
    this.navController.navigateRoot('/create-products');
  }
}
