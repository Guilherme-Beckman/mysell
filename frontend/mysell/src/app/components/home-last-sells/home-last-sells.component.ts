import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

export interface SaleItem {
  sellId: number;
  quantity: number;
  product: string;
  value: number;
  createdAt: string;
}

@Component({
  selector: 'app-home-last-sells',
  templateUrl: './home-last-sells.component.html',
  styleUrls: ['./home-last-sells.component.scss'],
  imports: [CommonModule],
})
export class HomeLastSalesComponent implements OnInit {
  @Input() sales: SaleItem[] = [];

  visibleCount = 6;

  constructor() {}

  ngOnInit(): void {}

  /** Sum of all sale values */
  totalValue(): number {
    return this.sales.reduce((acc, item) => acc + item.value, 0);
  }

  /** Show more items when clicking “Load more” */
  loadMore(): void {
    this.visibleCount += 6;
  }
}
