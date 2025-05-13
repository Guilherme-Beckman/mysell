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
  }

  private initializeSelectedProducts(): void {
    const hasExistingSelections =
      this.productSelectionService.getSelectedProducts().length > 0;
    this.hasAnyItemSelected = hasExistingSelections;
  }

  public getProgressPercentage(): number {
    return 50;
  }

  public onProductSelection(productSelects: ProductSelect[]): void {
    const selectedProducts = productSelects.map(
      (selection) => selection.product
    );
    this.selectedProducts.push(...selectedProducts);
    console.log('Selected products updated:', selectedProducts);
  }

  public navigateToProductEditing(): void {
    this.navigateToEditPage();
  }

  public closeCreateForm(): void {
    this.showCreateForm = false;
  }

  private getNewUniqueSelections(existingIds: Set<string>): Product[] {
    return this.productSelectionService
      .getSelectedProducts()
      .filter((product) => !existingIds.has(product.id));
  }

  private navigateToEditPage(): void {
    console.log('Redirecting to selected products:', this.selectedProducts);
    this.navController.navigateRoot('/edit-available-products');
  }
}
