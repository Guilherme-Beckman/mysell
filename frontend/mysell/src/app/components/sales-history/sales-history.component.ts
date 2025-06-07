import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellService } from 'src/app/services/sell.service';
import { getCategoryIconPath } from 'src/app/datas/categories';
import { IonSkeletonText } from '@ionic/angular/standalone';
import { ConfirmPopUpComponent } from '../confirm-pop-up/confirm-pop-up.component';
import { LoadingSppinerComponent } from '../loading-sppiner/loading-sppiner.component';
import { MessageService } from 'src/app/services/message.service';
import { MessagePerRequestComponent } from '../message-per-request/message-per-request.component';
@Component({
  selector: 'app-sales-history',
  standalone: true,
  templateUrl: './sales-history.component.html',
  styleUrls: ['./sales-history.component.scss'],
  imports: [
    IonSkeletonText,
    CommonModule,
    ConfirmPopUpComponent,
    LoadingSppinerComponent,
    MessagePerRequestComponent,
  ],
})
export class SalesHistoryComponent implements OnInit {
  sales: any[] = [];
  filter: string = '24h';
  isLoading = false;
  isLoadingActions = false;
  isConfirmPopupOpen = false;
  saleIdToDelete: string | null = null;
  public successMessage$ = this.messageService.successMessage$;
  public errorMessage$ = this.messageService.errorMessage$;
  constructor(
    private sellService: SellService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.sellService.getMySell().subscribe({
      next: (data) => {
        this.sales = data;
      },
      error: (err) => {
        console.error('Erro ao carregar vendas:', err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  setFilter(newFilter: string) {
    this.filter = newFilter;
  }

  get filteredSales(): any[] {
    if (!this.sales) {
      return [];
    }
    const now = new Date();
    let startDate;
    if (this.filter === '24h') {
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (this.filter === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (this.filter === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      return this.sales;
    }
    return this.sales.filter((sale) => new Date(sale.createdAt) >= startDate);
  }

  get totalSales(): number {
    return this.filteredSales.reduce(
      (sum, sale) => sum + sale.quantity * sale.productResponseDTO.priceToSell,
      0
    );
  }
  getCategoryIconPath(categoryName: string): string | undefined {
    return getCategoryIconPath(categoryName);
    {
    }
  }
  openConfirmPopup(saleId: string) {
    console.log('[Popup] Abrindo popup de confirmação para saleId:', saleId);
    this.saleIdToDelete = saleId;
    this.isConfirmPopupOpen = true;
  }

  closeConfirmPopup() {
    console.log('[Popup] Fechando popup de confirmação.');
    this.isConfirmPopupOpen = false;
  }

  confirmSaleDeletion() {
    this.isLoadingActions = true;

    if (!this.saleIdToDelete) {
      console.warn('[Delete] Nenhuma saleId definida para deletar.');
      this.isLoadingActions = false;
      return;
    }

    console.log(
      '[Delete] Iniciando deleção da venda com saleId:',
      this.saleIdToDelete
    );

    this.sellService.deleteSell(Number(this.saleIdToDelete)).subscribe({
      next: () => {
        console.log(
          '[Delete] Venda deletada com sucesso:',
          this.saleIdToDelete
        );
        console.log('[Delete] Lista de vendas antes da exclusão:', this.sales);

        this.sales = this.sales.filter(
          (sale) => sale.sellId !== this.saleIdToDelete
        );

        console.log('[Delete] Lista de vendas após a exclusão:', this.sales);

        this.messageService.setSuccessMessage(
          'Venda deletada com sucesso.',
          ''
        );
        this.isLoadingActions = false;
      },
      error: (err) => {
        console.error('[Delete] Erro ao deletar venda:', err);
        this.messageService.setErrorMessage(
          'Erro ao deletar a venda. Tente novamente.',
          ''
        );
        this.isLoadingActions = false;
      },
      complete: () => {
        console.log('[Delete] Finalizando processo de deleção.');
        this.isConfirmPopupOpen = false;
        this.saleIdToDelete = null;
      },
    });
  }
}
