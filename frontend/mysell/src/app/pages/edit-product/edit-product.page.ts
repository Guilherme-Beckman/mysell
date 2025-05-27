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
import { ConfirmButtonComponent } from 'src/app/components/confirm-button/confirm-button.component';
import { MessageService } from 'src/app/services/message.service';
import { LoadingSppinerComponent } from 'src/app/components/loading-sppiner/loading-sppiner.component';
import { ProductService } from 'src/app/services/product.service';
import { forkJoin } from 'rxjs';
import { MessagePerRequestComponent } from 'src/app/components/message-per-request/message-per-request.component';

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
    ConfirmPopUpComponent,
    CommonModule,
    ConfirmButtonComponent,
    LoadingSppinerComponent,
    MessagePerRequestComponent,
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
  isLoading = false;
  public successMessage$ = this.messageService.successMessage$;
  public errorMessage$ = this.messageService.errorMessage$;
  constructor(
    private navController: NavController,
    private originalProductSelection: ProductSelectionService,
    private messageService: MessageService,
    private productService: ProductService
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

  public navigateToYourProducts() {
    this.navController.navigateRoot('/your-products');
  }

  public confirmNavigationBack() {
    this.navigateToYourProducts();
  }

  public navigateToSelectedProducts() {
    this.navController.navigateRoot('/selected-products');
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
  public confirmUpdateProducts(): void {
    if (!this.selectedProducts.length) {
      this.messageService.setErrorMessage(
        'Nenhum produto selecionado para atualização.',
        ''
      );
      return;
    }

    this.isLoading = true;

    const updateObservables = this.selectedProducts.map((product) =>
      this.productService.updateProduct(product)
    );

    forkJoin(updateObservables).subscribe({
      next: () => {
        this.messageService.setSuccessMessage(
          'Produtos atualizados com sucesso!',
          ''
        );
        this.isLoading = false;
        setTimeout(() => {
          this.navController.navigateRoot('/home');
        }, 2000);
      },
      error: (error) => {
        this.messageService.setErrorMessage(
          'Erro ao atualizar produtos.',
          error
        );
        this.isLoading = false;
      },
    });
  }
}
