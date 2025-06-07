import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesHistoryComponent } from 'src/app/components/sales-history/sales-history.component';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
import { HomeRedirectComponent } from 'src/app/components/home-redirect/home-redirect.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SalesHistoryComponent,
    ArrowComponent,
    HomeRedirectComponent,
  ],
})
export class HistoryPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
