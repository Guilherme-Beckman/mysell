import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SalesHistoryComponent } from 'src/app/components/sales-history/sales-history.component';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
import { HomeRedirectComponent } from 'src/app/components/home-redirect/home-redirect.component';
import { SearchBarComponent } from 'src/app/components/search-bar/search-bar.component';
import { ReportHistoryComponentList } from 'src/app/components/report-history-list/report-history-list.component';

@Component({
  selector: 'app-report-history',
  templateUrl: './report-history.page.html',
  styleUrls: ['./report-history.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ArrowComponent,
    HomeRedirectComponent,
    SearchBarComponent,
    ReportHistoryComponentList,
  ],
})
export class ReportHistoryPage implements OnInit {
  public searchTerm: string = '';

  constructor() {}

  ngOnInit() {}
  public onSearchChange(term: string): void {
    this.searchTerm = term;
  }
}
