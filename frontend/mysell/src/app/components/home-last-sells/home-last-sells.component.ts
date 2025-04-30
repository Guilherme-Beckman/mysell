import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SellService } from 'src/app/services/sell.service';
import { IonSkeletonText } from '@ionic/angular/standalone';

export interface SaleItem {
  sellId: number;
  quantity: number;
  product: string;
  value: number;
  createdAt: string;
}

@Component({
  selector: 'app-home-last-sells',
  templateUrl: './home-last-sells.component.html',
  styleUrls: ['./home-last-sells.component.scss'],
  imports: [IonSkeletonText, CommonModule],
})
export class HomeLastSellsComponent implements OnInit {
  sales: SaleItem[] = [];
  visibleCount = 6;
  isLoading = false;

  constructor(private sellService: SellService) {}

  ngOnInit(): void {
    this.loadRecentSales();
  }

  private loadRecentSales(): void {
    this.isLoading = true;
    this.sellService.getMySell().subscribe({
      next: (response: any[]) => this.handleSalesResponse(response),
      error: (error) => this.handleSalesError(error),
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private handleSalesResponse(response: any[]): void {
    const now = new Date();
    const cutoff = this.getYesterday(now);

    this.sales = response
      .filter((item) => this.isWithinLast24Hours(item.createdAt, cutoff, now))
      .map((item) => this.transformToSaleItem(item));
  }

  private handleSalesError(error: any): void {
    console.error('Erro ao buscar vendas:', error);
    this.sales = [];
  }

  private getYesterday(referenceDate: Date): Date {
    return new Date(referenceDate.getTime() - 24 * 60 * 60 * 1000);
  }

  private isWithinLast24Hours(dateStr: string, from: Date, to: Date): boolean {
    const date = new Date(dateStr);
    return date >= from && date <= to;
  }

  private transformToSaleItem(item: any): SaleItem {
    return {
      sellId: item.sellId,
      quantity: item.quantity,
      product: item.productResponseDTO.name,
      value: item.quantity * item.productResponseDTO.priceToSell,
      createdAt: item.createdAt,
    };
  }

  /** Soma dos valores das vendas exibidas */
  totalValue(): number {
    return this.sales.reduce((sum, sale) => sum + sale.value, 0);
  }

  /** Carrega mais itens */
  loadMore(): void {
    this.visibleCount += 6;
  }

  /** Valor total formatado */
  totalValueFormatted(): string {
    return this.formatBigNumber(this.totalValue());
  }

  /** Formata números grandes em K, M, B */
  public formatBigNumber(value: number): string {
    if (value >= 1_000_000_000) return this.format(value, 1_000_000_000, 'B');
    if (value >= 1_000_000) return this.format(value, 1_000_000, 'M');
    if (value >= 100_000) return Math.round(value / 1_000) + 'K';
    if (value >= 10_000) return this.format(value, 1_000, 'K');
    if (value > 9_999) return '9999+';
    return value.toString();
  }

  private format(value: number, divisor: number, suffix: string): string {
    return (value / divisor).toFixed(1).replace(/\.0$/, '') + suffix;
  }
}
