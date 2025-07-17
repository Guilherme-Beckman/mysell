import { Component, Input, OnInit } from '@angular/core';
import { ProductNameSales } from '../report-info/report-info.component';
import { CommonModule } from '@angular/common';
import { IonSkeletonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-product-ranking',
  templateUrl: './product-ranking.component.html',
  styleUrls: ['./product-ranking.component.scss'],
  imports: [CommonModule, IonSkeletonText],
  standalone: true,
})
export class ProductRankingComponent implements OnInit {
  @Input() productRanking: ProductNameSales[] = [];
  @Input() isLoading: boolean = true;
  constructor() {}

  ngOnInit() {}
}
