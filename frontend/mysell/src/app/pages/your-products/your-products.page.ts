import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
import { ProductSelect } from 'src/app/components/available-products/available-products.component';
import { BottomArrowComponent } from 'src/app/components/bottom-arrow/bottom-arrow.component';
import { BottomEditPenComponent } from 'src/app/components/bottom-edit-pen/bottom-edit-pen.component';
import { BottomTrashcanComponent } from 'src/app/components/bottom-trashcan/bottom-trashcan.component';
import { ConfirmPopUpComponent } from 'src/app/components/confirm-pop-up/confirm-pop-up.component';
import { HomeRedirectComponent } from 'src/app/components/home-redirect/home-redirect.component';
import { LoadingSppinerComponent } from 'src/app/components/loading-sppiner/loading-sppiner.component';
import { MessagePerRequestComponent } from 'src/app/components/message-per-request/message-per-request.component';
import { SearchBarComponent } from 'src/app/components/search-bar/search-bar.component';
import { YourProductListComponent } from 'src/app/components/your-product-list/your-product-list.component';
import { Product } from 'src/app/interfaces/product';
import { EditProductSelectionServiceService } from 'src/app/services/edit-product-selection-service.service';
import { MessageService } from 'src/app/services/message.service';
import { ProductService } from 'src/app/services/product.service';
import { NavController } from '@ionic/angular/standalone';
@Component({
  selector: 'app-your-products',
  templateUrl: './your-products.page.html',
  styleUrls: ['./your-products.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ArrowComponent,
    HomeRedirectComponent,
    SearchBarComponent,
    LoadingSppinerComponent,
    MessagePerRequestComponent,
    YourProductListComponent,
    BottomTrashcanComponent,
    ConfirmPopUpComponent,
    BottomEditPenComponent,
  ],
})
export class YourProductsPage implements OnInit {
  @ViewChild(YourProductListComponent)
  productListComponent!: YourProductListComponent;

  public searchTerm: string = '';
  public isLoading = false;
  public successMessage$ = this.messageService.successMessage$;
  public errorMessage$ = this.messageService.errorMessage$;
  public hasAnyItemSelected = false;
  public selectedProducts: Product[] = [];
  public deleteProductPopup = false;
  constructor(
    private navController: NavController,
    private messageService: MessageService,
    private productService: ProductService,
    private productSelectionService: EditProductSelectionServiceService
  ) {}

  ngOnInit() {}
  public onSearchChange(term: string): void {
    this.searchTerm = term;
  }
  public navigateToEditPage(): void {
    this.productSelectionService.setSelectedProducts(this.selectedProducts);
    this.navController.navigateRoot('/edit-product');
  }
  onProductSelection(productSelections: ProductSelect[]) {
    const selectedProducts = productSelections.map(
      (selection) => selection.product
    );
    this.selectedProducts = [...selectedProducts];
    console.log('onProductSelection:', this.selectedProducts);
  }
  showDeleteConfirmation() {
    this.deleteProductPopup = true;
  }
  confirmProductsDeletion() {
    if (this.selectedProducts.length === 0) return;

    this.isLoading = true;

    const deletions$ = this.selectedProducts.map((product) =>
      this.productService.deleteProductById(product.id!)
    );

    forkJoin(deletions$).subscribe({
      next: () => {
        this.messageService.setSuccessMessage(
          'Produtos deletados com sucesso!',
          ''
        );

        this.productListComponent.reloadProducts();
      },
      error: (err) => {
        console.error('Erro ao deletar produtos:', err);
        this.messageService.setErrorMessage('Erro ao deletar produtos!', '');
      },
      complete: () => {
        this.isLoading = false;
        this.selectedProducts = [];
        this.hasAnyItemSelected = false;
        this.deleteProductPopup = false;
      },
    });
  }
}
