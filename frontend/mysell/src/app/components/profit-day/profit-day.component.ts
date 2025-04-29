import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-profit-day',
  templateUrl: './profit-day.component.html',
  styleUrls: ['./profit-day.component.scss'],
  imports: [CommonModule],
})
export class ProfitDayComponent implements OnInit {
  @Input() profit = 0;
  @Input() formattedProfit = '0';

  constructor(private reportService: ReportService) {}

  ngOnInit() {}
}
