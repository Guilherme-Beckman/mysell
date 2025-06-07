import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
import { HomeRedirectComponent } from 'src/app/components/home-redirect/home-redirect.component';
import { ReportRangeSelectorComponent } from 'src/app/components/report-range-selector/report-range-selector.component';
import {
  ReportInfoComponent,
  ProductNameSales,
} from 'src/app/components/report-info/report-info.component';
import { ReportService } from 'src/app/services/report.service';

interface DailyReport {
  date: string;
  profit: number;
  grossRevenue: number;
  numberOfSales: number;
}

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
  standalone: true,
  imports: [
    ArrowComponent,
    HomeRedirectComponent,
    CommonModule,
    FormsModule,
    ReportRangeSelectorComponent,
    ReportInfoComponent,
  ],
})
export class AnalyticsPage implements OnInit {
  profit: number = 0;
  totalRevenue: number = 0;
  sales: number = 0;
  productRanking: ProductNameSales[] = [];
  isLoading: boolean = false;

  // Mapeamento mais seguro dos dias da semana
  private readonly daysOfWeek = [
    'Domingo', // 0
    'Segunda-feira', // 1
    'Terça-feira', // 2
    'Quarta-feira', // 3
    'Quinta-feira', // 4
    'Sexta-feira', // 5
    'Sábado', // 6
  ];

  // Mapeamento alternativo para garantir consistência
  private readonly dayNameMap: Record<string, string> = {
    sunday: 'Domingo',
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    domingo: 'Domingo',
    segunda: 'Segunda-feira',
    terça: 'Terça-feira',
    quarta: 'Quarta-feira',
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira',
    sábado: 'Sábado',
  };

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.loadReport(1); // carrega o relatório diário por padrão
  }

  onDaySelected(day: number) {
    this.loadReport(day);
  }

  /**
   * Método mais seguro para obter o nome do dia em português
   * Usa múltiplas estratégias para garantir a conversão correta
   */
  private getDayNameInPortuguese(dateString: string): string {
    try {
      // Estratégia 1: Parse manual da data para evitar problemas de timezone
      const dateParts = dateString.split(/[-T]/);
      if (dateParts.length >= 3) {
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Mês é 0-indexado
        const day = parseInt(dateParts[2]);

        // Cria a data no timezone local para evitar mudanças de dia
        const date = new Date(year, month, day);
        const dayIndex = date.getDay();

        if (dayIndex >= 0 && dayIndex < this.daysOfWeek.length) {
          return this.daysOfWeek[dayIndex];
        }
      }

      // Estratégia 2: Usar Intl com configurações mais específicas
      const date = new Date(dateString + 'T12:00:00'); // Adiciona meio-dia para evitar problemas de timezone
      const dayName = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        timeZone: 'America/Sao_Paulo',
      }).format(date);

      // Capitaliza e normaliza o nome do dia
      const normalizedDayName =
        dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase();

      // Verifica se o nome está no nosso array de dias válidos
      const validDay = this.daysOfWeek.find(
        (day) => day.toLowerCase() === normalizedDayName.toLowerCase()
      );

      if (validDay) {
        return validDay;
      }

      // Estratégia 3: Fallback usando mapeamento manual
      const englishDayName = new Date(dateString + 'T12:00:00')
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toLowerCase();
      if (this.dayNameMap[englishDayName]) {
        return this.dayNameMap[englishDayName];
      }

      console.warn(
        `Não foi possível determinar o dia da semana para: ${dateString}`
      );
      return 'Dia desconhecido';
    } catch (error) {
      console.error('Erro ao processar data:', dateString, error);
      return 'Erro na data';
    }
  }

  /**
   * Método auxiliar para debug - mostra como a conversão está funcionando
   */
  private debugDateConversion(dateString: string): void {
    console.log(`Data original: ${dateString}`);

    const strategies = [
      () => {
        const dateParts = dateString.split(/[-T]/);
        const date = new Date(
          parseInt(dateParts[0]),
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[2])
        );
        return `Manual: ${
          this.daysOfWeek[date.getDay()]
        } (índice: ${date.getDay()})`;
      },
      () => {
        const date = new Date(dateString + 'T12:00:00');
        return `Intl: ${new Intl.DateTimeFormat('pt-BR', {
          weekday: 'long',
        }).format(date)}`;
      },
      () => {
        const date = new Date(dateString);
        return `Direto: ${
          this.daysOfWeek[date.getDay()]
        } (índice: ${date.getDay()})`;
      },
    ];

    strategies.forEach((strategy, index) => {
      try {
        console.log(`Estratégia ${index + 1}: ${strategy()}`);
      } catch (error) {
        console.log(`Estratégia ${index + 1}: Erro - ${error}`);
      }
    });

    console.log(`Resultado final: ${this.getDayNameInPortuguese(dateString)}`);
    console.log('---');
  }

  private loadReport(day: number) {
    this.isLoading = true;
    const report$ =
      day === 1
        ? this.reportService.getDailyReport()
        : this.reportService.getWeeklyReport();

    report$.subscribe((report) => {
      this.profit = report.profit;
      this.totalRevenue = report.grossRevenue;
      this.sales = report.numberOfSales;

      if (day === 1) {
        // Relatório diário — ranking por produto
        this.productRanking = report.sellsByProduct
          .map(
            (item: any): ProductNameSales => ({
              name: item.productResponseDTO.name,
              sales: item.saleCount,
            })
          )
          .sort(
            (a: ProductNameSales, b: ProductNameSales) => b.sales - a.sales
          );
      } else {
        // Relatório semanal — ranking por dia da semana, com dias zerados
        const salesMap: Record<string, number> = {};

        // Inicializa todos os dias com zero
        this.daysOfWeek.forEach((day) => {
          salesMap[day] = 0;
        });

        // Processa os relatórios diários
        report.dailyReports.forEach((item: DailyReport) => {
          // Ativa o debug se necessário (remova em produção)
          // this.debugDateConversion(item.date);

          const dayName = this.getDayNameInPortuguese(item.date);

          // Garante que o dia é válido antes de somar
          if (this.daysOfWeek.includes(dayName)) {
            salesMap[dayName] += item.numberOfSales;
          } else {
            console.warn(
              `Dia inválido encontrado: ${dayName} para data ${item.date}`
            );
          }
        });

        // Cria o ranking dos dias
        this.productRanking = Object.entries(salesMap)
          .map(([name, sales]) => ({ name, sales }))
          .sort((a, b) => b.sales - a.sales);
      }

      this.isLoading = false;
    });
  }

  /**
   * Método utilitário para testar a conversão de datas
   * Pode ser chamado no ngOnInit para debug
   */
  private testDateConversions(): void {
    const testDates = [
      '2025-06-02', // Segunda
      '2025-06-03', // Terça
      '2025-06-04', // Quarta
      '2025-06-05', // Quinta
      '2025-06-06', // Sexta
      '2025-06-07', // Sábado
      '2025-06-08', // Domingo
    ];

    console.log('=== TESTE DE CONVERSÃO DE DATAS ===');
    testDates.forEach((date) => {
      this.debugDateConversion(date);
    });
  }
}
