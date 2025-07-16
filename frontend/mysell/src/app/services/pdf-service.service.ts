import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { FileOpener } from '@capacitor-community/file-opener';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LocalNotifications } from '@capacitor/local-notifications';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

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

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private platform: Platform) {}

  async generateDailyReportPDF(report: DailyReport): Promise<void> {
    try {
      // Detectar se é mobile para ajustar configurações
      const isMobile = this.platform.is('mobile');

      // Configurações otimizadas para mobile
      const doc = new jsPDF({
        orientation: isMobile ? 'portrait' : 'landscape',
        unit: 'mm',
        format: isMobile ? 'a4' : 'a4',
        compress: true,
      });

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margins = { top: 15, left: 10, right: 10, bottom: 15 };

      // Header
      doc.setFontSize(isMobile ? 14 : 16);
      doc.setTextColor(40, 44, 52);
      doc.text('Relatório de Vendas Diário', pageWidth / 2, margins.top, {
        align: 'center',
      });

      // Date
      doc.setFontSize(isMobile ? 10 : 12);
      doc.setTextColor(100, 100, 100);
      const formattedDate = this.formatDate(report.date);
      doc.text(formattedDate, pageWidth / 2, margins.top + 8, {
        align: 'center',
      });

      // Summary section
      let currentY = margins.top + 20;
      doc.setFontSize(isMobile ? 12 : 14);
      doc.setTextColor(40, 44, 52);
      doc.text('Resumo Geral', margins.left, currentY);

      // Summary boxes - Layout vertical para mobile
      currentY += 10;
      doc.setFontSize(isMobile ? 9 : 10);

      if (isMobile) {
        this.addSummaryItem(
          doc,
          'Total de Vendas:',
          report.numberOfSales.toString(),
          margins.left,
          currentY
        );
        currentY += 12;
        this.addSummaryItem(
          doc,
          'Receita Bruta:',
          this.formatCurrency(report.grossRevenue),
          margins.left,
          currentY
        );
        currentY += 12;
        this.addSummaryItem(
          doc,
          'Lucro Total:',
          this.formatCurrency(report.profit),
          margins.left,
          currentY
        );
        currentY += 15;
      } else {
        this.addSummaryItem(
          doc,
          'Total de Vendas:',
          report.numberOfSales.toString(),
          margins.left,
          currentY
        );
        this.addSummaryItem(
          doc,
          'Receita Bruta:',
          this.formatCurrency(report.grossRevenue),
          margins.left + 70,
          currentY
        );
        this.addSummaryItem(
          doc,
          'Lucro Total:',
          this.formatCurrency(report.profit),
          margins.left + 140,
          currentY
        );
        currentY += 15;
      }

      // Products table
      doc.setFontSize(isMobile ? 12 : 14);
      doc.setTextColor(40, 44, 52);
      doc.text('Vendas por Produto', margins.left, currentY);

      // Prepare table data
      const tableData = report.sellsByProduct.map((productSale) => {
        const product = productSale.productResponseDTO;
        const unit = `${product.productUnitOfMeasureDTO.quantity}${product.productUnitOfMeasureDTO.unityOfMeasure.name}`;
        const margin =
          ((product.priceToSell - product.purchasedPrice) /
            product.priceToSell) *
          100;

        if (isMobile) {
          return [
            this.truncateText(product.name, 18),
            productSale.saleCount.toString(),
            this.formatCurrency(product.priceToSell),
            this.formatCurrency(productSale.profit),
            `${margin.toFixed(1)}%`,
          ];
        } else {
          return [
            this.truncateText(product.name, 20),
            `${this.truncateText(product.brand, 15)} - ${unit}`,
            this.truncateText(product.category.name, 15),
            productSale.saleCount.toString(),
            this.formatCurrency(product.priceToSell),
            this.formatCurrency(productSale.grossRevenue),
            this.formatCurrency(productSale.profit),
            `${margin.toFixed(1)}%`,
          ];
        }
      });

      // Table headers
      const tableHeaders = isMobile
        ? ['Produto', 'Qtd.', 'Preço', 'Lucro', 'Margem']
        : [
            'Produto',
            'Marca/Unid.',
            'Categoria',
            'Qtd.',
            'Preço Un.',
            'Receita',
            'Lucro',
            'Margem',
          ];

      // Column styles
      const columnStyles = this.getColumnStyles(isMobile);

      // Create table
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: currentY + 8,
        theme: 'striped',
        headStyles: {
          fillColor: [220, 38, 38],
          textColor: [255, 255, 255],
          fontSize: isMobile ? 7 : 8,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: isMobile ? 6 : 7,
          textColor: [60, 60, 60],
          cellPadding: isMobile ? 1.5 : 2,
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
        columnStyles: columnStyles,
        margin: { left: margins.left, right: margins.right },
        tableWidth: 'auto',
        styles: {
          overflow: 'linebreak',
          cellWidth: 'wrap',
        },
        didDrawPage: (data: any) => {
          this.addPageFooter(doc, pageWidth, pageHeight, margins);
        },
      });

      // Save/Share the PDF
      const fileName = `relatorio_${report.date.replace(/\//g, '-')}.pdf`;
      await this.handlePdfOutput(doc, fileName);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  }

  async generateGeneralReportPDF(report: GeneralReport): Promise<void> {
    try {
      const isMobile = this.platform.is('mobile');

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margins = { top: 15, left: 10, right: 10, bottom: 15 };

      // Header
      doc.setFontSize(isMobile ? 16 : 18);
      doc.setTextColor(40, 44, 52);
      doc.text('Relatório Geral de Vendas', pageWidth / 2, margins.top, {
        align: 'center',
      });

      // Period
      doc.setFontSize(isMobile ? 11 : 12);
      doc.setTextColor(100, 100, 100);
      doc.text(report.period, pageWidth / 2, margins.top + 8, {
        align: 'center',
      });

      // Date range
      doc.setFontSize(isMobile ? 9 : 10);
      const dateRange = `${this.formatDate(
        report.startDate
      )} até ${this.formatDate(report.endDate)}`;
      doc.text(dateRange, pageWidth / 2, margins.top + 15, {
        align: 'center',
      });

      let currentY = margins.top + 25;

      // Summary section
      doc.setFontSize(isMobile ? 12 : 14);
      doc.setTextColor(40, 44, 52);
      doc.text('Resumo Consolidado', margins.left, currentY);

      currentY += 10;
      doc.setFontSize(isMobile ? 9 : 10);

      // Summary items (vertical layout)
      this.addSummaryItem(
        doc,
        'Total de Vendas:',
        report.totalSales.toString(),
        margins.left,
        currentY
      );
      currentY += 12;

      this.addSummaryItem(
        doc,
        'Receita Total:',
        this.formatCurrency(report.totalRevenue),
        margins.left,
        currentY
      );
      currentY += 12;

      this.addSummaryItem(
        doc,
        'Lucro Total:',
        this.formatCurrency(report.totalProfit),
        margins.left,
        currentY
      );
      currentY += 12;

      // Calculate and show average margin
      const averageMargin =
        report.totalRevenue > 0
          ? (report.totalProfit / report.totalRevenue) * 100
          : 0;

      this.addSummaryItem(
        doc,
        'Margem Média:',
        `${averageMargin.toFixed(1)}%`,
        margins.left,
        currentY
      );
      currentY += 20;

      // Top selling products section
      if (report.topSellingProducts && report.topSellingProducts.length > 0) {
        doc.setFontSize(isMobile ? 12 : 14);
        doc.setTextColor(40, 44, 52);
        doc.text('Top Produtos Mais Vendidos', margins.left, currentY);

        const topProductsData = report.topSellingProducts.map(
          (product, index) => [
            `${index + 1}º`,
            this.truncateText(product.productName, isMobile ? 25 : 30),
            this.truncateText(product.brand, isMobile ? 15 : 20),
            product.totalSales.toString(),
            this.formatCurrency(product.totalRevenue),
            this.formatCurrency(product.totalProfit),
          ]
        );

        const topProductsHeaders = [
          'Pos.',
          'Produto',
          'Marca',
          'Qtd.',
          'Receita',
          'Lucro',
        ];

        autoTable(doc, {
          head: [topProductsHeaders],
          body: topProductsData,
          startY: currentY + 8,
          theme: 'striped',
          headStyles: {
            fillColor: [34, 197, 94],
            textColor: [255, 255, 255],
            fontSize: isMobile ? 7 : 8,
            fontStyle: 'bold',
          },
          bodyStyles: {
            fontSize: isMobile ? 6 : 7,
            textColor: [60, 60, 60],
            cellPadding: isMobile ? 1.5 : 2,
          },
          alternateRowStyles: {
            fillColor: [248, 248, 248],
          },
          columnStyles: {
            0: { cellWidth: 12, halign: 'center' }, // Pos.
            1: { cellWidth: 'auto', minCellWidth: 40 }, // Produto
            2: { cellWidth: 'auto', minCellWidth: 25 }, // Marca
            3: { cellWidth: 20, halign: 'center' }, // Qtd.
            4: { cellWidth: 30, halign: 'right' }, // Receita
            5: { cellWidth: 30, halign: 'right' }, // Lucro
          },
          margin: { left: margins.left, right: margins.right },
          didDrawPage: (data: any) => {
            this.addPageFooter(doc, pageWidth, pageHeight, margins);
          },
        });

        currentY = (doc as any).lastAutoTable.finalY + 15;
      }

      // Daily performance section
      if (report.dailyReports && report.dailyReports.length > 0) {
        // Check if we need a new page
        if (currentY > pageHeight - 100) {
          doc.addPage();
          currentY = margins.top;
        }

        doc.setFontSize(isMobile ? 12 : 14);
        doc.setTextColor(40, 44, 52);
        doc.text('Desempenho Diário', margins.left, currentY);

        const dailyData = report.dailyReports.map((dailyReport) => [
          this.formatDateShort(dailyReport.date),
          dailyReport.numberOfSales.toString(),
          this.formatCurrency(dailyReport.grossRevenue),
          this.formatCurrency(dailyReport.profit),
          dailyReport.grossRevenue > 0
            ? `${(
                (dailyReport.profit / dailyReport.grossRevenue) *
                100
              ).toFixed(1)}%`
            : '0%',
        ]);

        const dailyHeaders = ['Data', 'Vendas', 'Receita', 'Lucro', 'Margem'];

        autoTable(doc, {
          head: [dailyHeaders],
          body: dailyData,
          startY: currentY + 8,
          theme: 'striped',
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: [255, 255, 255],
            fontSize: isMobile ? 7 : 8,
            fontStyle: 'bold',
          },
          bodyStyles: {
            fontSize: isMobile ? 6 : 7,
            textColor: [60, 60, 60],
            cellPadding: isMobile ? 1.5 : 2,
          },
          alternateRowStyles: {
            fillColor: [248, 248, 248],
          },
          columnStyles: {
            0: { cellWidth: 30, halign: 'center' }, // Data
            1: { cellWidth: 25, halign: 'center' }, // Vendas
            2: { cellWidth: 35, halign: 'right' }, // Receita
            3: { cellWidth: 35, halign: 'right' }, // Lucro
            4: { cellWidth: 25, halign: 'right' }, // Margem
          },
          margin: { left: margins.left, right: margins.right },
          didDrawPage: (data: any) => {
            this.addPageFooter(doc, pageWidth, pageHeight, margins);
          },
        });
      }

      // Save/Share the PDF
      const fileName = `relatorio_geral_${report.startDate.replace(
        /\//g,
        '-'
      )}_${report.endDate.replace(/\//g, '-')}.pdf`;
      await this.handlePdfOutput(doc, fileName);
    } catch (error) {
      console.error('Erro ao gerar PDF geral:', error);
      throw error;
    }
  }

  private getColumnStyles(isMobile: boolean): { [key: string]: any } {
    const columnStyles: { [key: string]: any } = {};

    if (isMobile) {
      columnStyles['0'] = { cellWidth: 'auto' as const, minCellWidth: 35 };
      columnStyles['1'] = {
        cellWidth: 'auto' as const,
        minCellWidth: 15,
        halign: 'center' as const,
      };
      columnStyles['2'] = {
        cellWidth: 'auto' as const,
        minCellWidth: 25,
        halign: 'right' as const,
      };
      columnStyles['3'] = {
        cellWidth: 'auto' as const,
        minCellWidth: 25,
        halign: 'right' as const,
      };
      columnStyles['4'] = {
        cellWidth: 'auto' as const,
        minCellWidth: 20,
        halign: 'right' as const,
      };
    } else {
      columnStyles['0'] = { cellWidth: 'auto' as const, minCellWidth: 25 };
      columnStyles['1'] = { cellWidth: 'auto' as const, minCellWidth: 25 };
      columnStyles['2'] = { cellWidth: 'auto' as const, minCellWidth: 20 };
      columnStyles['3'] = {
        cellWidth: 'auto' as const,
        minCellWidth: 12,
        halign: 'center' as const,
      };
      columnStyles['4'] = {
        cellWidth: 'auto' as const,
        minCellWidth: 18,
        halign: 'right' as const,
      };
      columnStyles['5'] = {
        cellWidth: 'auto' as const,
        minCellWidth: 20,
        halign: 'right' as const,
      };
      columnStyles['6'] = {
        cellWidth: 'auto' as const,
        minCellWidth: 18,
        halign: 'right' as const,
      };
      columnStyles['7'] = {
        cellWidth: 'auto' as const,
        minCellWidth: 15,
        halign: 'right' as const,
      };
    }

    return columnStyles;
  }

  private addPageFooter(
    doc: jsPDF,
    pageWidth: number,
    pageHeight: number,
    margins: any
  ): void {
    const pageNumber = doc.getCurrentPageInfo().pageNumber;
    const totalPages = doc.getNumberOfPages();

    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${pageNumber} de ${totalPages}`,
      pageWidth - margins.right,
      pageHeight - margins.bottom,
      { align: 'right' }
    );

    doc.text(
      `Gerado em: ${new Date().toLocaleDateString('pt-BR')}`,
      margins.left,
      pageHeight - margins.bottom
    );
  }

  private async handlePdfOutput(doc: jsPDF, fileName: string): Promise<void> {
    if (this.platform.is('capacitor')) {
      await this.savePDFToDevice(doc, fileName);
    } else {
      doc.save(fileName);
    }
  }

  private addSummaryItem(
    doc: jsPDF,
    label: string,
    value: string,
    x: number,
    y: number
  ): void {
    doc.setTextColor(100, 100, 100);
    doc.text(label, x, y);
    doc.setTextColor(220, 38, 38);
    doc.text(value, x, y + 5);
  }

  private async savePDFToDevice(doc: jsPDF, fileName: string): Promise<void> {
    try {
      const pdfOutput = doc.output('datauristring');
      const base64Data = pdfOutput.split(',')[1];

      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });

      const filePath = result.uri;

      const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') {
        console.warn('Permissão de notificação negada.');
        return;
      }

      LocalNotifications.addListener(
        'localNotificationActionPerformed',
        async () => {
          try {
            await FileOpener.open({
              filePath,
              contentType: 'application/pdf',
            });
          } catch (error) {
            console.error('Erro ao abrir o arquivo PDF:', error);
          }
        }
      );

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 1,
            title: 'Download concluído!',
            body: 'Toque para abrir ou compartilhar o relatório.',
            schedule: { at: new Date(Date.now() + 1000) },
            attachments: [{ id: '1', url: filePath }],
          },
        ],
      });

      try {
        await Share.share({
          title: 'Relatório de Vendas',
          text: 'Confira o relatório de vendas em PDF.',
          url: filePath,
          dialogTitle: 'Compartilhar Relatório PDF',
        });
      } catch (shareError) {
        console.warn(
          'Compartilhamento cancelado ou não suportado:',
          shareError
        );

        const toast = document.createElement('ion-toast');
        toast.message = 'Relatório salvo! Você pode compartilhar mais tarde.';
        toast.duration = 3000;
        toast.color = 'medium';
        toast.position = 'bottom';
        document.body.appendChild(toast);
        await toast.present();
      }
    } catch (error) {
      console.error('Erro ao salvar PDF:', error);
      throw error;
    }
  }

  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  private formatDate(dateString: string): string {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private formatDateShort(dateString: string): string {
    const date = new Date(`${dateString}T00:00:00`);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
