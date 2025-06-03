import { CommonModule } from '@angular/common';
import { Component, Input, input, OnInit } from '@angular/core';
export interface ProductNameSales {
  name: string;
  sales: number;
}
@Component({
  selector: 'app-report-info',
  templateUrl: './report-info.component.html',
  styleUrls: ['./report-info.component.scss'],
  imports: [CommonModule],
})
export class ReportInfoComponent implements OnInit {
  @Input() profit: number = 0;
  @Input() sales: number = 0;
  @Input() productRanking: ProductNameSales[] = [];

  constructor() {}

  ngOnInit() {}
}
