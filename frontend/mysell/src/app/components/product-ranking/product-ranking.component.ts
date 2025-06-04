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

  ngOnInit() {
    this.productRanking = [
      { name: 'Arroz Tio João', sales: 15 },
      { name: 'Feijão Camil', sales: 12 },
      { name: 'Macarrão Renata', sales: 9 },
      { name: 'Açúcar União', sales: 7 },
      { name: 'Café Pilão', sales: 5 },
      { name: 'Café Pilão', sales: 5 },
      { name: 'Café Pilão', sales: 5 },
      { name: 'Café Pilão', sales: 5 },
      { name: 'Café Pilão', sales: 5 },
      { name: 'Café Pilão', sales: 5 },
      { name: 'Café Pilão', sales: 5 },
      { name: 'Café Pilão', sales: 5 },
      { name: 'Café Pilão', sales: 5 },
    ];
  }
}
