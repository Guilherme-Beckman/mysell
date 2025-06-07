import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesHistoryComponent } from 'src/app/components/sales-history/sales-history.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [CommonModule, SalesHistoryComponent],
})
export class HistoryPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
