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
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { N } from '@angular/core/navigation_types.d-Lh6SmhKv';
import { NavController } from '@ionic/angular/standalone';
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

  private readonly daysOfWeek = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

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

  constructor(
    private reportService: ReportService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.loadReport(1);
  }

  onDaySelected(day: number) {
    this.loadReport(day);
  }

  private getDayNameInPortuguese(dateString: string): string {
    try {
      const dateParts = dateString.split(/[-T]/);
      if (dateParts.length >= 3) {
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1;
        const day = parseInt(dateParts[2]);

        const date = new Date(year, month, day);
        const dayIndex = date.getDay();

        if (dayIndex >= 0 && dayIndex < this.daysOfWeek.length) {
          return this.daysOfWeek[dayIndex];
        }
      }

      const date = new Date(dateString + 'T12:00:00');
      const dayName = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        timeZone: 'America/Sao_Paulo',
      }).format(date);

      const normalizedDayName =
        dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase();

      const validDay = this.daysOfWeek.find(
        (day) => day.toLowerCase() === normalizedDayName.toLowerCase()
      );

      if (validDay) {
        return validDay;
      }

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

    report$
      .pipe(
        catchError((error) => {
          console.error('Erro ao carregar relatório:', error);
          this.isLoading = false;
          return of({
            profit: 0,
            grossRevenue: 0,
            numberOfSales: 0,
            sellsByProduct: [],
            dailyReports: [],
          });
        })
      )
      .subscribe((report) => {
        this.profit = report.profit;
        this.totalRevenue = report.grossRevenue;
        this.sales = report.numberOfSales;

        if (day === 1) {
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
          const salesMap: Record<string, number> = {};
          this.daysOfWeek.forEach((day) => (salesMap[day] = 0));

          report.dailyReports.forEach((item: DailyReport) => {
            const dayName = this.getDayNameInPortuguese(item.date);
            if (this.daysOfWeek.includes(dayName)) {
              salesMap[dayName] += item.numberOfSales;
            } else {
              console.warn(
                `Dia inválido encontrado: ${dayName} para data ${item.date}`
              );
            }
          });

          this.productRanking = Object.entries(salesMap)
            .map(([name, sales]) => ({ name, sales }))
            .sort((a, b) => b.sales - a.sales);
        }

        this.isLoading = false;
      });
  }

  private testDateConversions(): void {
    const testDates = [
      '2025-06-02',
      '2025-06-03',
      '2025-06-04',
      '2025-06-05',
      '2025-06-06',
      '2025-06-07',
      '2025-06-08',
    ];

    console.log('=== TESTE DE CONVERSÃO DE DATAS ===');
    testDates.forEach((date) => {
      this.debugDateConversion(date);
    });
  }
  navigateToReportHistory() {
    this.navController.navigateRoot('/report-history');
  }
}
