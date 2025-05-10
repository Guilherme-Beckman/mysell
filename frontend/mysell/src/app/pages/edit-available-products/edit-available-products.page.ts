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
  public selectedProducts: Product[] = [];
  public productExclusionId: string = '';
  constructor(
    private navController: NavController,
    private router: Router,
    private productSelection: ProductSelectionService
  ) {}

  ngOnInit() {
    this.selectedProducts = this.productSelection.getSelectedProducts();
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
  public closeConfirmPopUp() {
    console.log('closeConfirmPopUp');
    this.isConfirmPopUpAtive = false;
  }
  public redirectBack() {
    this.navController.navigateRoot('/create-products');
  }
  public redirectFront() {
    this.navController.navigateRoot('/selected-products');
  }
  public confirmProductExclusion() {
    this.productSelection.removeProduct(this.productExclusionId);
    this.selectedProducts = this.productSelection.getSelectedProducts();
  }

  public trackByProductId(index: number, item: Product): string {
    return item.id;
  }
}
