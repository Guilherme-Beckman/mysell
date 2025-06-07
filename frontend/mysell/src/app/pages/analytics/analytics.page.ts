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

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.loadReport(1); // carrega o relatório diário por padrão
  }

  onDaySelected(day: number) {
    this.loadReport(day);
  }

  private getDayNameInPortuguese(dateString: string): string {
    const days = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];
    const date = new Date(dateString);
    return days[date.getDay()];
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
        // Relatório semanal — ranking por dia da semana
        this.productRanking = report.dailyReports
          .map((item: DailyReport): ProductNameSales => {
            const dayName = this.getDayNameInPortuguese(item.date);
            return {
              name: dayName,
              sales: item.numberOfSales,
            };
          })
          .sort(
            (a: ProductNameSales, b: ProductNameSales) => b.sales - a.sales
          );
      }

      this.isLoading = false;
    });
  }
}
