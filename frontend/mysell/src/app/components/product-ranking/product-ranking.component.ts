import { Component, Input, OnInit } from '@angular/core';
import { ProductNameSales } from '../report-info/report-info.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-ranking',
  templateUrl: './product-ranking.component.html',
  styleUrls: ['./product-ranking.component.scss'],
  imports: [CommonModule],
})
export class ProductRankingComponent implements OnInit {
  @Input() productRanking: ProductNameSales[] = [];
  constructor() {}

  ngOnInit() {}
}
