import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { TotalSellsComponent } from '../total-sells/total-sells.component';
import { ProfitDayComponent } from '../profit-day/profit-day.component';

@Component({
  selector: 'app-sells-profit-info',
  templateUrl: './sells-profit-info.component.html',
  styleUrls: ['./sells-profit-info.component.scss'],
  imports: [TotalSellsComponent, ProfitDayComponent],
})
export class SellsProfitInfoComponent implements OnInit {
  public totalSells = 0;
  public profit = 0;
  public formattedTotalSells = '0';
  public formattedProfit = '0';
  public isLoading = false;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.reportService.getDailyReport().subscribe({
      next: (report) => {
        this.isLoading = false;
        this.totalSells = report.numberOfSales ?? 0;
        this.profit = report.profit ?? 0;
        this.formattedTotalSells = this.formatBigNumber(this.totalSells);
        this.formattedProfit = this.formatBigNumber(this.profit);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao buscar relatório diário:', err);
        this.formattedTotalSells = '0';
        this.formattedProfit = '0';
      },
    });
  }

  private formatBigNumber(value: number): string {
    if (value >= 1_000_000_000)
      return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    if (value >= 1_000_000)
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (value >= 100_000) return Math.round(value / 1_000) + 'K';
    if (value >= 10_000)
      return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    if (value > 9_999) return '9999+';
    return value.toString();
  }
}
