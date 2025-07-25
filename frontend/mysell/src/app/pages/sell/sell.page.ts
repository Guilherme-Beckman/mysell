import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CounterComponent } from 'src/app/components/counter/counter.component';
import { LoadingSppinerComponent } from 'src/app/components/loading-sppiner/loading-sppiner.component';
import { MessagePerRequestComponent } from 'src/app/components/message-per-request/message-per-request.component';
import { SearchBarComponent } from 'src/app/components/search-bar/search-bar.component';
import { ConfirmButtonComponent } from 'src/app/components/confirm-button/confirm-button.component';
import { ConfirmPopUpComponent } from 'src/app/components/confirm-pop-up/confirm-pop-up.component';
import { HomeRedirectComponent } from 'src/app/components/home-redirect/home-redirect.component';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
import { MessageService } from 'src/app/services/message.service';
import {
  ProductSelectCount,
  ProductsToSellComponent,
} from 'src/app/components/products-to-sell/products-to-sell.component';
import { ConfirmSellPopUpComponent } from 'src/app/components/confirm-sell-pop-up/confirm-sell-pop-up.component';
import { SellService } from 'src/app/services/sell.service';
import { forkJoin } from 'rxjs';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-sell',
  templateUrl: './sell.page.html',
  styleUrls: ['./sell.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSppinerComponent,
    MessagePerRequestComponent,
    SearchBarComponent,
    ArrowComponent,
    HomeRedirectComponent,
    ProductsToSellComponent,
    ConfirmButtonComponent,
    ConfirmSellPopUpComponent,
  ],
})
export class SellPage implements OnInit {
  public isLoading = false;
  public searchTerm: string = '';
  public successMessage$ = this.messageService.successMessage$;
  public errorMessage$ = this.messageService.errorMessage$;
  public hasAnyItemSelected = false;
  public selectedProducts: ProductSelectCount[] = [];
  public confirmPopupVisible = false;
  constructor(
    private messageService: MessageService,
    private sellService: SellService,
    private navController: NavController
  ) {}

  ngOnInit() {}
  public onSearchChange(term: string): void {
    this.searchTerm = term;
  }
  onProductSelection(selected: ProductSelectCount[]) {
    this.selectedProducts = selected;
  }
  showConfirmPopup() {
    this.confirmPopupVisible = true;
  }
  closeConfirmPopup() {
    this.confirmPopupVisible = false;
  }
  public confirmSell() {
    if (this.selectedProducts.length === 0) return;

    this.isLoading = true;

    const sellRequests$ = this.selectedProducts.map((product) =>
      this.sellService.sellProduct(product.product.id, product.count)
    );

    forkJoin(sellRequests$).subscribe({
      next: () => {
        this.messageService.setSuccessMessage(
          'Venda realizada com sucesso!',
          ''
        );
      },
      error: (err) => {
        console.error('Erro ao realizar venda:', err);
        this.messageService.setErrorMessage('Erro ao realizar venda!', '');
      },
      complete: () => {
        this.isLoading = false;
        this.selectedProducts = [];
        this.hasAnyItemSelected = false;
        this.confirmPopupVisible = false;
      },
    });
  }
}
