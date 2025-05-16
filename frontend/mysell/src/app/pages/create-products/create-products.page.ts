import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
import { HomeRedirectComponent } from 'src/app/components/home-redirect/home-redirect.component';
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
import { ProductSelectionService } from 'src/app/services/product-selection.service';
import { Product } from 'src/app/interfaces/product';
import { ProguessBarComponent } from 'src/app/components/proguess-bar/proguess-bar.component';

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
  public showCreateForm = false;
  public selectedProducts: Product[] = [];
  public progress = 2;
  public currentProgress = 0;
  public actionButtons: AddProductButton[] = [
    {
      svgPath: '/assets/svg/add-product.svg',
      action: () => null,
    },
    {
      svgPath: '/assets/svg/barcode.svg',
      action: () => null,
    },
  ];

  constructor(
    private navController: NavController,
    private productSelectionService: ProductSelectionService
  ) {}

  ngOnInit() {
    this.initializeSelectedProducts();
    this.animateProgress();
  }

  public onProductSelection(productSelections: ProductSelect[]): void {
    const selectedProducts = productSelections.map(
      (selection) => selection.product
    );
    this.selectedProducts.push(...selectedProducts);
  }

  public navigateToProductEditing(): void {
    this.navigateToEditPage();
  }

  public closeCreateForm(): void {
    this.showCreateForm = false;
  }

  private animateProgress(): void {
    const interval = setInterval(() => {
      if (this.currentProgress < this.progress) {
        this.currentProgress++;
      } else {
        clearInterval(interval);
      }
    }, 5);
  }

  private initializeSelectedProducts(): void {
    const hasExistingSelections =
      this.productSelectionService.getSelectedProducts().length > 0;
    this.hasAnyItemSelected = hasExistingSelections;
  }

  private navigateToEditPage(): void {
    this.navController.navigateRoot('/edit-available-products');
  }
}
