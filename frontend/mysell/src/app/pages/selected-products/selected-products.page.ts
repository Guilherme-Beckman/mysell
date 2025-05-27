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
import { ProductService } from 'src/app/services/product.service';
import { forkJoin } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { MessagePerRequestComponent } from 'src/app/components/message-per-request/message-per-request.component';
import { LoadingSppinerComponent } from 'src/app/components/loading-sppiner/loading-sppiner.component';

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
    MessagePerRequestComponent,
    LoadingSppinerComponent,
  ],
})
export class SelectedProductsPage implements OnInit {
  public selectedProducts: Product[] = [];
  public isConfirmationPopupActive = false;
  public productIdToExclude = '';
  public maxProgress = 100;
  public currentProgressValue = 50;
  public isNavigateHomeConfirmationActive = false;
  public isLoading = false;
  public successMessage$ = this.messageService.successMessage$;
  public errorMessage$ = this.messageService.errorMessage$;
  constructor(
    private navController: NavController,
    private editedProductSelectionService: EditedProductSelectionService,
    private productService: ProductService,
    private messageService: MessageService
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
  public navigateHome(): void {
    this.navController.navigateRoot('/home');
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

  public confirmCreateProducts(): void {
    if (!this.selectedProducts.length) {
      this.messageService.setErrorMessage(
        'Nenhum produto selecionado para criação.',
        ''
      );
      return;
    }
    this.editedProductSelectionService.clear();
    this.isLoading = true; // se quiser um loading (crie a propriedade isLoading na página)

    const creationObservables = this.selectedProducts.map((product) =>
      this.productService.createProduct(product)
    );

    forkJoin(creationObservables).subscribe({
      next: () => {
        this.messageService.setSuccessMessage(
          'Produtos criados com sucesso!',
          ''
        );
        this.isLoading = false;
        setTimeout(() => {
          this.navigateHome();
        }, 2000);
      },
      error: (error) => {
        this.messageService.setErrorMessage('Erro ao criar produtos.', error);
        this.isLoading = false;
      },
    });
  }
}
