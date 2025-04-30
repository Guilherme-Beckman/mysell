import { CommonModule } from '@angular/common';
import { ApplicationModule, Component, Input, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { ReportService } from 'src/app/services/report.service';
import { IonSkeletonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-total-sells',
  templateUrl: './total-sells.component.html',
  styleUrls: ['./total-sells.component.scss'],
  imports: [CommonModule, IonSkeletonText],
})
export class TotalSellsComponent implements OnInit {
  @Input() totalSells = 0;
  @Input() formattedTotalSells = '0';
  @Input() isLoading = false;
  constructor(private reportService: ReportService) {}
  ngOnInit(): void {}
}
