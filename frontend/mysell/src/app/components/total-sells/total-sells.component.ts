import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-total-sells',
  templateUrl: './total-sells.component.html',
  styleUrls: ['./total-sells.component.scss'],
})
export class TotalSellsComponent implements OnInit {
  public totalSells: number = 0;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadTotalSells();
  }

  private loadTotalSells(): void {
    this.reportService.getDailyReport().subscribe({
      next: (report: any) => this.handleSellResponse(report),
      error: (error) => this.handleSellError(error),
    });
  }

  private handleSellResponse(report: any): void {
    console.log(report);

    if (report && report.numberOfSales != null) {
      this.totalSells = report.numberOfSales;
    } else {
      this.totalSells = 0;
    }
  }

  private handleSellError(error: any): void {
    console.error('Erro ao buscar vendas:', error);
    this.totalSells = 0;
  }
}
