import { CommonModule } from '@angular/common';
import { Component, Input, input, OnInit } from '@angular/core';
import { ProductRankingComponent } from '../product-ranking/product-ranking.component';
import { PizzaGraphComponent } from '../pizza-graph/pizza-graph.component';
export interface ProductNameSales {
  name: string;
  sales: number;
}
@Component({
  selector: 'app-report-info',
  templateUrl: './report-info.component.html',
  styleUrls: ['./report-info.component.scss'],
  imports: [CommonModule, ProductRankingComponent, PizzaGraphComponent],
})
export class ReportInfoComponent implements OnInit {
  @Input() profit: number = 0;
  @Input() sales: number = 0;
  @Input() productRanking: ProductNameSales[] = [];
  @Input() totalRevenue: number = 0;
  public isExpanded = false;
  constructor() {}

  ngOnInit() {}
  expandGraph() {
    this.isExpanded = !this.isExpanded;
  }
  closeGraphInfo() {
    this.isExpanded = false;
  }
}
