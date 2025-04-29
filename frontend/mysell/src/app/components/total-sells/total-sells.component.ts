import { Component, OnInit } from '@angular/core';
import { SellService } from 'src/app/services/sell.service';

@Component({
  selector: 'app-total-sells',
  templateUrl: './total-sells.component.html',
  styleUrls: ['./total-sells.component.scss'],
})
export class TotalSellsComponent implements OnInit {
  public totalSells: number = 0;

  constructor(private sellService: SellService) {}

  ngOnInit(): void {
    this.loadTotalSells();
  }

  private loadTotalSells(): void {
    this.sellService.getMySell().subscribe({
      next: (sells: any[]) => this.handleSellResponse(sells),
      error: (error) => this.handleSellError(error),
    });
  }

  private handleSellResponse(sells: any[]): void {
    console.log(sells);

    if (Array.isArray(sells) && sells.length > 0) {
      this.totalSells = this.calculateTotalQuantity(sells);
    } else {
      this.totalSells = 0;
    }
  }

  private handleSellError(error: any): void {
    console.error('Erro ao buscar vendas:', error);
    this.totalSells = 0;
  }

  private calculateTotalQuantity(sells: any[]): number {
    return sells
      .map((sell) => sell.quantity)
      .reduce((acc, curr) => acc + curr, 0);
  }
}
