import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { IonSkeletonText } from '@ionic/angular/standalone';
@Component({
  selector: 'app-profit-day',
  templateUrl: './profit-day.component.html',
  styleUrls: ['./profit-day.component.scss'],
  imports: [CommonModule, IonSkeletonText],
})
export class ProfitDayComponent implements OnInit {
  @Input() profit = 0;
  @Input() formattedProfit = '0';
  isLoading = true;

  constructor(private reportService: ReportService) {}

  ngOnInit() {}
}
