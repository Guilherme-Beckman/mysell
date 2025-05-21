import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArrowComponent } from '../components/arrow/arrow.component';
import { HomeRedirectComponent } from '../components/home-redirect/home-redirect.component';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { LoadingSppinerComponent } from '../components/loading-sppiner/loading-sppiner.component';
import { MessagePerRequestComponent } from '../components/message-per-request/message-per-request.component';
import { BottomArrowComponent } from '../components/bottom-arrow/bottom-arrow.component';
import { NavController } from '@ionic/angular';
import { MessageService } from '../services/message.service';
import { YourProductListComponent } from '../components/your-product-list/your-product-list.component';
import { ProductSelect } from '../components/available-products/available-products.component';
import { BottomTrashcanComponent } from '../components/bottom-trashcan/bottom-trashcan.component';
import { Product } from '../interfaces/product';
import { ConfirmPopUpComponent } from '../components/confirm-pop-up/confirm-pop-up.component';
import { ProductService } from '../services/product.service';
import { forkJoin } from 'rxjs';

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
    BottomArrowComponent,
    LoadingSppinerComponent,
    MessagePerRequestComponent,
    YourProductListComponent,
    BottomTrashcanComponent,
    ConfirmPopUpComponent,
  ],
})
export class YourProductsPage implements OnInit {
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
    private productService: ProductService
  ) {}

  ngOnInit() {}
  public onSearchChange(term: string): void {
    this.searchTerm = term;
  }
  public navigateToEditPage(): void {
    this.navController.navigateRoot('/edit-available-products');
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
        this.refreshProductList();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao deletar produtos:', err);
        this.messageService.setErrorMessage('Erro ao deletar produtos!', '');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        this.selectedProducts = [];
        this.hasAnyItemSelected = false;
        this.deleteProductPopup = false;
      },
    });
  }

  private refreshProductList() {
    this.productService.getMyProducts().subscribe({
      next: (products) => {
        this.selectedProducts = [];
        const yourListComponent = document.querySelector(
          'app-your-product-list'
        ) as any;
        if (yourListComponent?.reloadWithProducts) {
          yourListComponent.reloadWithProducts(products);
        }
      },
      error: (err) => {
        console.error('Erro ao recarregar produtos:', err);
      },
    });
  }
}
