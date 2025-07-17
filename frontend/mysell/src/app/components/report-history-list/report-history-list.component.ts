import { Component, Input, OnInit } from '@angular/core';
import { SellService } from '../../services/sell.service';
import { MessageService } from '../../services/message.service';
import { CommonModule } from '@angular/common';
import { LoadingSppinerComponent } from '../loading-sppiner/loading-sppiner.component';
import { ConfirmPopUpComponent } from '../confirm-pop-up/confirm-pop-up.component';
import { MessagePerRequestComponent } from '../message-per-request/message-per-request.component';
import {
  IonSkeletonText,
  LoadingController,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { ReportService } from 'src/app/services/report.service';
import { getCategoryIconPath } from 'src/app/datas/categories';
import { PdfService } from 'src/app/services/pdf-service.service';

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

// Interface para o relatório geral
interface GeneralReport {
  startDate: string;
  endDate: string;
  period: string;
  totalRevenue: number;
  totalProfit: number;
  totalSales: number;
  dailyReports: DailyReport[];
  topSellingProducts: {
    productName: string;
    brand: string;
    category: string;
    totalSales: number;
    totalRevenue: number;
    totalProfit: number;
  }[];
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
  generatingPdfReports: Set<string> = new Set();
  isGeneratingGeneralPdf = false;
  public successMessage$ = this.messageService.successMessage$;
  public errorMessage$ = this.messageService.errorMessage$;

  constructor(
    private reportService: ReportService,
    private messageService: MessageService,
    private pdfService: PdfService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
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

  // Método para gerar relatório geral em PDF
  async generateGeneralReportPDF(): Promise<void> {
    // Verificar se há dados para gerar o relatório
    if (!this.filteredReports || this.filteredReports.length === 0) {
      const alert = await this.alertController.create({
        header: 'Aviso',
        message: 'Não há dados suficientes para gerar o relatório geral.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    this.isGeneratingGeneralPdf = true;

    const loading = await this.loadingController.create({
      message: 'Gerando relatório geral...',
      spinner: 'crescent',
      translucent: true,
      cssClass: 'custom-loading',
    });

    await loading.present();

    try {
      // Construir o relatório geral
      const generalReport = this.buildGeneralReport();

      // Gerar PDF usando o serviço
      await this.pdfService.generateGeneralReportPDF(generalReport);

      await loading.dismiss();

      this.messageService.setSuccessMessage(
        'Relatório geral gerado com sucesso!',
        'O relatório consolidado foi salvo e pode ser compartilhado.'
      );
    } catch (error) {
      await loading.dismiss();
      console.error('Erro ao gerar relatório geral:', error);

      const alert = await this.alertController.create({
        header: 'Erro ao compartilhar PDF',
        message:
          'Não foi possível compartilhar o relatório, mas ele foi baixado com sucesso.',
        buttons: [
          {
            text: 'Tentar novamente',
            handler: () => {
              this.generateGeneralReportPDF();
            },
          },
          {
            text: 'Cancelar',
            role: 'cancel',
          },
        ],
      });

      await alert.present();
    } finally {
      this.isGeneratingGeneralPdf = false;
    }
  }

  // Método para construir o relatório geral
  private buildGeneralReport(): GeneralReport {
    const filtered = this.filteredReports;
    const startDate =
      filtered.length > 0 ? filtered[filtered.length - 1].date : '';
    const endDate = filtered.length > 0 ? filtered[0].date : '';

    // Calcular produtos mais vendidos
    const productSalesMap = new Map<
      string,
      {
        productName: string;
        brand: string;
        category: string;
        totalSales: number;
        totalRevenue: number;
        totalProfit: number;
      }
    >();

    filtered.forEach((report) => {
      report.sellsByProduct.forEach((productSale) => {
        const product = productSale.productResponseDTO;
        const key = `${product.name}-${product.brand}`;

        if (productSalesMap.has(key)) {
          const existing = productSalesMap.get(key)!;
          existing.totalSales += productSale.saleCount;
          existing.totalRevenue += productSale.grossRevenue;
          existing.totalProfit += productSale.profit;
        } else {
          productSalesMap.set(key, {
            productName: product.name,
            brand: product.brand,
            category: product.category.name,
            totalSales: productSale.saleCount,
            totalRevenue: productSale.grossRevenue,
            totalProfit: productSale.profit,
          });
        }
      });
    });

    // Ordenar produtos por vendas
    const topSellingProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 10); // Top 10 produtos

    return {
      startDate,
      endDate,
      period: this.getPeriodDescription(),
      totalRevenue: this.totalRevenue,
      totalProfit: this.totalProfit,
      totalSales: this.totalSales,
      dailyReports: filtered,
      topSellingProducts,
    };
  }

  // Método para obter descrição do período
  private getPeriodDescription(): string {
    switch (this.filter) {
      case '7d':
        return 'Últimos 7 dias';
      case '30d':
        return 'Últimos 30 dias';
      case '90d':
        return 'Últimos 90 dias';
      case 'all':
        return 'Todos os períodos';
      default:
        return 'Período personalizado';
    }
  }

  // Método adaptado para usar async/await e feedback visual melhorado
  async generatePDF(report: DailyReport): Promise<void> {
    // Verificar se há dados para gerar o PDF
    if (!report.sellsByProduct || report.sellsByProduct.length === 0) {
      const alert = await this.alertController.create({
        header: 'Aviso',
        message: 'Este relatório não possui dados de vendas para gerar o PDF.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Adicionar ao set de relatórios sendo gerados
    this.generatingPdfReports.add(report.date);

    // Criar loading personalizado
    const loading = await this.loadingController.create({
      message: 'Gerando PDF...',
      spinner: 'crescent',
      translucent: true,
      cssClass: 'custom-loading',
    });

    await loading.present();

    try {
      // Usar o serviço PDF adaptado para mobile
      await this.pdfService.generateDailyReportPDF(report);

      // Fechar loading
      await loading.dismiss();

      // Também usar o serviço de mensagem existente
      this.messageService.setSuccessMessage(
        'PDF gerado com sucesso!',
        'O relatório foi salvo e pode ser compartilhado.'
      );
    } catch (error) {
      // Fechar loading em caso de erro
      await loading.dismiss();

      console.error('Erro ao gerar PDF:', error);

      // Mostrar alerta de erro
      const alert = await this.alertController.create({
        header: 'Erro ao compartilhar PDF',
        message:
          'Não foi possível compartilhar o relatório, mas ele foi baixado com sucesso.',
        buttons: [
          {
            text: 'Tentar novamente',
            handler: () => {
              this.generatePDF(report);
            },
          },
          {
            text: 'Cancelar',
            role: 'cancel',
          },
        ],
      });

      await alert.present();

      // Também usar o serviço de mensagem existente
    } finally {
      // Remover do set de relatórios sendo gerados
      this.generatingPdfReports.delete(report.date);
    }
  }

  // Método para gerar PDF com confirmação
  async generatePDFWithConfirmation(report: DailyReport): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Gerar PDF',
      message: `Deseja gerar o relatório em PDF para o dia ${this.getFormattedDate(
        report.date
      )}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Gerar',
          handler: () => {
            this.generatePDF(report);
          },
        },
      ],
    });

    await alert.present();
  }

  // Método para gerar múltiplos PDFs
  async generateMultiplePDFs(reports: DailyReport[]): Promise<void> {
    if (reports.length === 0) {
      const toast = await this.toastController.create({
        message: 'Nenhum relatório selecionado',
        duration: 2000,
        position: 'bottom',
        color: 'warning',
      });
      await toast.present();
      return;
    }

    const alert = await this.alertController.create({
      header: 'Gerar PDFs',
      message: `Deseja gerar ${reports.length} relatório(s) em PDF?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Gerar todos',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: `Gerando ${reports.length} PDF(s)...`,
              spinner: 'crescent',
            });

            await loading.present();

            try {
              for (const report of reports) {
                await this.pdfService.generateDailyReportPDF(report);
              }

              await loading.dismiss();

              const toast = await this.toastController.create({
                message: `${reports.length} PDF(s) gerado(s) com sucesso!`,
                duration: 3000,
                position: 'bottom',
                color: 'success',
              });

              await toast.present();
            } catch (error) {
              await loading.dismiss();
              console.error('Erro ao gerar PDFs:', error);

              const errorAlert = await this.alertController.create({
                header: 'Erro',
                message: 'Erro ao gerar alguns relatórios. Tente novamente.',
                buttons: ['OK'],
              });

              await errorAlert.present();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  isGeneratingPdf(date: string): boolean {
    return this.generatingPdfReports.has(date);
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

  // Método auxiliar para verificar se é mobile
  get isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  // Método para formatar moeda
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  // Método para calcular margem de lucro
  calculateMargin(product: ProductSale): number {
    const { purchasedPrice, priceToSell } = product.productResponseDTO;
    if (purchasedPrice === 0) return 0; // Evitar divisão por zero
    return ((priceToSell - purchasedPrice) / priceToSell) * 100;
  }
}
