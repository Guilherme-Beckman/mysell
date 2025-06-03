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
import { ReportInfoComponent } from 'src/app/components/report-info/report-info.component';

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
  constructor() {}

  ngOnInit() {}
}
