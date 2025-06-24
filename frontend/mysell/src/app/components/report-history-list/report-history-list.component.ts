import { Component, Input, OnInit } from '@angular/core';
import { SellService } from '../../services/sell.service';
import { MessageService } from '../../services/message.service';
import { getCategoryIconPath } from '../../datas/categories';
import { CommonModule } from '@angular/common';
import { LoadingSppinerComponent } from '../loading-sppiner/loading-sppiner.component';
import { ConfirmPopUpComponent } from '../confirm-pop-up/confirm-pop-up.component';
import { MessagePerRequestComponent } from '../message-per-request/message-per-request.component';
import { IonSkeletonText } from '@ionic/angular/standalone';
@Component({
  selector: 'app-report-history-list',
  templateUrl: './report-history-list.component.html',
  styleUrls: ['./report-history-list.component.scss'],
  imports: [
    IonSkeletonText,
    CommonModule,
    ConfirmPopUpComponent,
    LoadingSppinerComponent,
    MessagePerRequestComponent,
  ],
})
export class ReportHistoryComponentList implements OnInit {
  @Input() searchTerm: string = '';
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

  normalizeText(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  setFilter(newFilter: string) {
    this.filter = newFilter;
  }

  get filteredSales(): any[] {
    if (!this.sales) return [];

    const now = new Date();
    let startDate: Date | null = null;

    if (this.filter === '24h') {
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (this.filter === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (this.filter === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const term = this.normalizeText(this.searchTerm.toLowerCase().trim());

    return this.sales.filter((sale) => {
      const saleDate = new Date(sale.createdAt);
      const matchDate = !startDate || saleDate >= startDate;

      const normalizedName = this.normalizeText(
        sale.productResponseDTO.name.toLowerCase()
      );
      const normalizedBrand = this.normalizeText(
        sale.productResponseDTO.brand.toLowerCase()
      );
      const normalizedCategory = this.normalizeText(
        sale.productResponseDTO.category.name.toLowerCase()
      );
      const matchText =
        !term ||
        normalizedName.includes(term) ||
        normalizedBrand.includes(term) ||
        normalizedCategory.includes(term);

      return matchDate && matchText;
    });
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
