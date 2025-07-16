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
        orientation: isMobile ? 'portrait' : 'landscape', // Portrait é melhor para mobile
        unit: 'mm',
        format: isMobile ? 'a4' : 'a4',
        compress: true, // Comprimir para reduzir tamanho
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
        // Layout vertical para mobile
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
        // Layout horizontal para desktop
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

      // Prepare table data - diferentes colunas para mobile/desktop
      const tableData = report.sellsByProduct.map((productSale) => {
        const product = productSale.productResponseDTO;
        const unit = `${product.productUnitOfMeasureDTO.quantity}${product.productUnitOfMeasureDTO.unityOfMeasure.name}`;
        const margin =
          ((product.priceToSell - product.purchasedPrice) /
            product.priceToSell) *
          100;

        if (isMobile) {
          // Menos colunas para mobile
          return [
            this.truncateText(product.name, 18),
            productSale.saleCount.toString(),
            this.formatCurrency(product.priceToSell),
            this.formatCurrency(productSale.profit),
            `${margin.toFixed(1)}%`,
          ];
        } else {
          // Todas as colunas para desktop
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

      // Table headers - diferentes para mobile/desktop
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

      // Column styles - diferentes para mobile/desktop
      const columnStyles: { [key: string]: any } = {};

      if (isMobile) {
        columnStyles['0'] = { cellWidth: 'auto' as const, minCellWidth: 35 }; // Produto
        columnStyles['1'] = {
          cellWidth: 'auto' as const,
          minCellWidth: 15,
          halign: 'center' as const,
        }; // Qtd.
        columnStyles['2'] = {
          cellWidth: 'auto' as const,
          minCellWidth: 25,
          halign: 'right' as const,
        }; // Preço
        columnStyles['3'] = {
          cellWidth: 'auto' as const,
          minCellWidth: 25,
          halign: 'right' as const,
        }; // Lucro
        columnStyles['4'] = {
          cellWidth: 'auto' as const,
          minCellWidth: 20,
          halign: 'right' as const,
        }; // Margem
      } else {
        columnStyles['0'] = { cellWidth: 'auto' as const, minCellWidth: 25 }; // Produto
        columnStyles['1'] = { cellWidth: 'auto' as const, minCellWidth: 25 }; // Marca/Unidade
        columnStyles['2'] = { cellWidth: 'auto' as const, minCellWidth: 20 }; // Categoria
        columnStyles['3'] = {
          cellWidth: 'auto' as const,
          minCellWidth: 12,
          halign: 'center' as const,
        }; // Qtd.
        columnStyles['4'] = {
          cellWidth: 'auto' as const,
          minCellWidth: 18,
          halign: 'right' as const,
        }; // Preço
        columnStyles['5'] = {
          cellWidth: 'auto' as const,
          minCellWidth: 20,
          halign: 'right' as const,
        }; // Receita
        columnStyles['6'] = {
          cellWidth: 'auto' as const,
          minCellWidth: 18,
          halign: 'right' as const,
        }; // Lucro
        columnStyles['7'] = {
          cellWidth: 'auto' as const,
          minCellWidth: 15,
          halign: 'right' as const,
        }; // Margem
      }

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
          // Footer
          const pageNumber = doc.getCurrentPageInfo().pageNumber;
          const totalPages = doc.getNumberOfPages();

          doc.setFontSize(isMobile ? 6 : 7);
          doc.setTextColor(150, 150, 150);
          doc.text(
            `Página ${pageNumber} de ${totalPages}`,
            pageWidth - margins.right,
            pageHeight - margins.bottom,
            { align: 'right' }
          );

          // Generation date
          doc.text(
            `Gerado em: ${new Date().toLocaleDateString('pt-BR')}`,
            margins.left,
            pageHeight - margins.bottom
          );
        },
      });

      // Save/Share the PDF based on platform
      const fileName = `relatorio_${report.date.replace(/\//g, '-')}.pdf`;

      if (this.platform.is('capacitor')) {
        // Mobile: Save and share
        await this.savePDFToDevice(doc, fileName);
      } else {
        // Web: Direct download
        doc.save(fileName);
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
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

      // Solicita permissão para notificação
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') {
        console.warn('Permissão de notificação negada.');
        return;
      }

      // Registra listener para clique na notificação
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

      // Dispara a notificação
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

      // Tenta compartilhar, mas trata cancelamento como sucesso
      try {
        await Share.share({
          title: 'Relatório Diário de Vendas',
          text: 'Confira o relatório diário de vendas em PDF.',
          url: filePath,
          dialogTitle: 'Compartilhar Relatório PDF',
        });
      } catch (shareError) {
        console.warn(
          'Compartilhamento cancelado ou não suportado:',
          shareError
        );

        // Mostra um toast amigável
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

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
