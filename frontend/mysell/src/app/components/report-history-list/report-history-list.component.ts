import { Component, Input, OnInit } from '@angular/core';
import { SellService } from '../../services/sell.service';
import { MessageService } from '../../services/message.service';
import { CommonModule } from '@angular/common';
import { LoadingSppinerComponent } from '../loading-sppiner/loading-sppiner.component';
import { ConfirmPopUpComponent } from '../confirm-pop-up/confirm-pop-up.component';
import { MessagePerRequestComponent } from '../message-per-request/message-per-request.component';
import { IonSkeletonText } from '@ionic/angular/standalone';
import { ReportService } from 'src/app/services/report.service';
import { getCategoryIconPath } from 'src/app/datas/categories';
interface ProductSale {
  saleCount: number;
  profit: number;
  grossRevenue: number;
  productResponseDTO: {
    productsId: number;
    name: string;
    category: {
      name: string;
      gpcCode: number;
    };
    purchasedPrice: number;
    priceToSell: number;
    brand: string;
    productUnitOfMeasureDTO: {
      quantity: number;
      unityOfMeasure: {
        name: string;
      };
    };
  };
}

interface DailyReport {
  date: string;
  profit: number;
  grossRevenue: number;
  numberOfSales: number;
  sellsByProduct: ProductSale[];
}
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
  reports: DailyReport[] = [];
  filter: string = '7d';
  isLoading = false;
  expandedReports: Set<string> = new Set();
  public successMessage$ = this.messageService.successMessage$;
  public errorMessage$ = this.messageService.errorMessage$;

  constructor(
    private reportService: ReportService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading = true;
    this.reportService.getDailyReportHistory().subscribe({
      next: (data) => {
        this.reports = data.sort(
          (a: DailyReport, b: DailyReport) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.reports.forEach((report) => {
          console.log(`Relatório de ${report.date}:`, report);
          report.sellsByProduct.forEach((productSale) => {
            console.log(
              `Produto: ${productSale.productResponseDTO.name}, Vendas: ${productSale.saleCount}, Lucro: ${productSale.profit}, Receita Bruta: ${productSale.grossRevenue}`
            );
          });
        });
      },
      error: (err) => {
        console.error('Erro ao carregar relatórios:', err);
        this.messageService.setErrorMessage(
          'Erro ao carregar relatórios. Tente novamente.',
          ''
        );
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
    this.expandedReports.clear();
  }

  get filteredReports(): DailyReport[] {
    if (!this.reports) return [];

    const now = new Date();
    let startDate: Date | null = null;

    if (this.filter === '7d') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (this.filter === '30d') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (this.filter === '90d') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }

    const term = this.normalizeText(this.searchTerm.toLowerCase().trim());

    return this.reports.filter((report) => {
      const reportDate = new Date(report.date);
      const matchDate = !startDate || reportDate >= startDate;

      if (!term) return matchDate;

      // Buscar nos produtos do relatório
      const matchText = report.sellsByProduct.some((productSale) => {
        const product = productSale.productResponseDTO;
        const normalizedName = this.normalizeText(product.name.toLowerCase());
        const normalizedBrand = this.normalizeText(product.brand.toLowerCase());
        const normalizedCategory = this.normalizeText(
          product.category.name.toLowerCase()
        );

        return (
          normalizedName.includes(term) ||
          normalizedBrand.includes(term) ||
          normalizedCategory.includes(term)
        );
      });

      return matchDate && matchText;
    });
  }

  get totalRevenue(): number {
    return this.filteredReports.reduce(
      (sum, report) => sum + report.grossRevenue,
      0
    );
  }

  get totalProfit(): number {
    return this.filteredReports.reduce((sum, report) => sum + report.profit, 0);
  }

  get totalSales(): number {
    return this.filteredReports.reduce(
      (sum, report) => sum + report.numberOfSales,
      0
    );
  }

  getCategoryIconPath(categoryName: string): string | undefined {
    return getCategoryIconPath(categoryName);
  }

  toggleReportExpansion(date: string): void {
    if (this.expandedReports.has(date)) {
      this.expandedReports.delete(date);
    } else {
      this.expandedReports.add(date);
    }
  }

  isReportExpanded(date: string): boolean {
    return this.expandedReports.has(date);
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getFormattedUnit(product: ProductSale): string {
    const unit = product.productResponseDTO.productUnitOfMeasureDTO;
    return `${unit.quantity}${unit.unityOfMeasure.name}`;
  }
}
