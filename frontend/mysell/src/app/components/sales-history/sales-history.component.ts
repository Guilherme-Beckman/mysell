import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellService } from 'src/app/services/sell.service';
import { getCategoryIconPath } from 'src/app/datas/categories';
import { IonSkeletonText } from '@ionic/angular/standalone';
@Component({
  selector: 'app-sales-history',
  standalone: true,
  templateUrl: './sales-history.component.html',
  styleUrls: ['./sales-history.component.scss'],
  imports: [IonSkeletonText, CommonModule],
})
export class SalesHistoryComponent implements OnInit {
  sales: any[] = [];
  filter: string = '7d';
  isLoading = false;
  constructor(private sellService: SellService) {}

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
}
