import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-last-sells',
  templateUrl: './home-last-sells.component.html',
  styleUrls: ['./home-last-sells.component.scss'],
  imports: [CommonModule],
})
export class HomeLastSellsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  vendas = [
    { quantidade: 3, produto: 'Arroz', valor: 78.0 },
    { quantidade: 1, produto: 'Leite', valor: 12.0 },
    { quantidade: 15, produto: 'Skoll', valor: 90.0 },
    { quantidade: 1, produto: 'Exemplo', valor: 0.0 },
    { quantidade: 1, produto: 'Exemplo', valor: 0.0 },
    { quantidade: 1, produto: 'Exemplo', valor: 0.0 },
  ];

  sum(): number {
    return this.vendas.reduce((acc, item) => acc + item.valor, 0);
  }
}
