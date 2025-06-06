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

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.reportService.getDailyReport().subscribe((report) => {
      this.profit = report.profit;
      this.totalRevenue = report.grossRevenue;
      this.sales = report.numberOfSales;
      this.productRanking = report.sellsByProduct.map((item: any) => ({
        name: item.productResponseDTO.name,
        sales: item.saleCount,
      }));
    });
  }
}
