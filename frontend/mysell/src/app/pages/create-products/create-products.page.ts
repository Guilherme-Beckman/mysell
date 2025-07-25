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
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular/standalone';
import { ProductService } from 'src/app/services/product.service';
import { LoadingSppinerComponent } from 'src/app/components/loading-sppiner/loading-sppiner.component';
import { ConfirmPopUpComponent } from 'src/app/components/confirm-pop-up/confirm-pop-up.component';
import { MessagePerRequestComponent } from 'src/app/components/message-per-request/message-per-request.component';
import { MessageService } from 'src/app/services/message.service';
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
    LoadingSppinerComponent,
    ConfirmPopUpComponent,
    MessagePerRequestComponent,
  ],
})
export class CreateProductsPage implements OnInit {
  public hasAnyItemSelected = false;
  public showCreateProductForm = false;
  public showCreateProductScanedForm = false;
  public successMessage$ = this.messageService.successMessage$;
  public errorMessage$ = this.messageService.errorMessage$;
  public selectedProducts: Product[] = [];
  public progress = 2;
  public currentProgress = 0;
  public searchTerm: string = '';
  public isLoading = false;
  public isPopupForScanFailedActive = false;
  public popupMessage = '';
  public scanedProduct: Product = {
    id: '',
    name: '',
    category: '',
    purchasePrice: 0,
    sellingPrice: 0,
    brand: '',
    measure: {
      quantity: 0,
      unitOfMeasure: '',
    },
  };
  public actionButtons: AddProductButton[] = [
    {
      svgPath: '/assets/svg/add-product.svg',
      action: () => {
        this.showCreateProductForm = true;
      },
    },
    {
      svgPath: '/assets/svg/barcode.svg',
      action: () => this.scan(),
    },
  ];

  public isSupported = false;
  public barcodes: Barcode[] = [];
  constructor(
    private navController: NavController,
    private productSelectionService: ProductSelectionService,
    private alertController: AlertController,
    private productService: ProductService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initializeSelectedProducts();
    this.animateProgress();
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  public onSearchChange(term: string): void {
    this.searchTerm = term;
  }

  public onProductSelection(productSelections: ProductSelect[]): void {
    const selectedProducts = productSelections.map(
      (selection) => selection.product
    );
    this.selectedProducts = [...selectedProducts];
  }

  public navigateToProductEditing(): void {
    this.navigateToEditPage();
  }

  public closeCreateProductForm(): void {
    this.showCreateProductForm = false;
  }
  public closeCreateScanedForm(): void {
    this.showCreateProductScanedForm = false;
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

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes[0] = barcodes[0];
    this.getProductByBarcode(barcodes[0].rawValue);
    console.log(barcodes);
  }
  private getProductByBarcode(barcode: string): void {
    console.log('Buscando produto com código de barras:', barcode);

    this.isLoading = true; // Início do loading
    this.productService.getProductByBarcode(barcode).subscribe({
      next: (product) => {
        console.log('Produto encontrado:', product);
        this.scanedProduct = product;
        this.isLoading = false; // Fim do loading no sucesso
        this.showCreateProductScanedForm = true;
      },
      error: (error) => {
        console.error('Erro ao buscar o produto:', error);
        this.isLoading = false; // Fim do loading no erro

        if (error.status === 404) {
          // Produto não encontrado
          this.isPopupForScanFailedActive = true;
          this.popupMessage = 'Produto não encontrado';
        } else {
          // Outros erros
          this.isPopupForScanFailedActive = true;
          this.popupMessage =
            'Erro ao buscar o produto. Tente novamente mais tarde';
        }
      },
    });
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }
  public closePopup() {
    this.isPopupForScanFailedActive = false;
    this.popupMessage = '';
    this.scanedProduct = {
      id: '',
      name: '',
      category: '',
      purchasePrice: 0,
      sellingPrice: 0,
      brand: '',
      measure: {
        quantity: 0,
        unitOfMeasure: '',
      },
    };
  }
  public createProduct(product: Product) {
    console.log('[createProduct] Iniciando criação de produto...');
    console.log('[createProduct] Produto recebido:', product);

    this.isLoading = true;
    console.log('[createProduct] isLoading ativado');

    this.productService.createProduct(product).subscribe({
      next: () => {
        console.log('[createProduct] Produto criado com sucesso na API');
        this.isLoading = false;
        console.log('[createProduct] isLoading desativado');
        this.messageService.setSuccessMessage(
          'Produto criado com sucesso!',
          ''
        );
        this.closeCreateProductForm();
        console.log('[createProduct] Formulário manual fechado');
        this.closeCreateScanedForm();
        console.log('[createProduct] Formulário escaneado fechado');
      },
      error: (error) => {
        console.error('[createProduct] Erro ao criar produto:', error);
        this.isLoading = false;
        console.log('[createProduct] isLoading desativado após erro');
        this.messageService.setErrorMessage('Erro ao criar produto.', error);
      },
    });
  }
}
