import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-profit-day',
  templateUrl: './profit-day.component.html',
  styleUrls: ['./profit-day.component.scss'],
  imports: [CommonModule],
})
export class ProfitDayComponent implements OnInit {
  public profit: number = 0;

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.loadProfit();
  }

  private loadProfit(): void {
    this.reportService.getDailyReport().subscribe({
      next: (report: any) => {
        if (report && report.profit != null) {
          this.profit = report.profit;
        } else {
          this.profit = 0;
        }
      },
      error: (error) => {
        console.error('Erro ao buscar lucro diário:', error);
        this.profit = 0;
      },
    });
  }
}
