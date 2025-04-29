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
    { quantidade: 2, produto: 'Coca-Cola', valor: 10.0 },
    { quantidade: 5, produto: 'Pão', valor: 20.0 },
    { quantidade: 1, produto: 'Presunto', valor: 15.0 },
    { quantidade: 2, produto: 'Queijo', valor: 25.0 },
    { quantidade: 4, produto: 'Refrigerante', valor: 22.0 },
    { quantidade: 3, produto: 'Macarrão', valor: 9.0 },
    { quantidade: 6, produto: 'Feijão', valor: 35.0 },
    { quantidade: 2, produto: 'Azeite', valor: 28.0 },
    { quantidade: 1, produto: 'Margarina', valor: 7.0 },
    { quantidade: 2, produto: 'Ovos', valor: 12.0 },
    { quantidade: 3, produto: 'Sabão', valor: 18.0 },
    { quantidade: 4, produto: 'Detergente', valor: 14.0 },
    { quantidade: 1, produto: 'Café', valor: 10.0 },
    { quantidade: 5, produto: 'Açúcar', valor: 17.0 },
    { quantidade: 2, produto: 'Sal', valor: 5.0 },
    { quantidade: 1, produto: 'Molho de Tomate', valor: 6.0 },
    { quantidade: 3, produto: 'Farinha', valor: 9.0 },
    { quantidade: 2, produto: 'Papel Higiênico', valor: 8.0 },
    { quantidade: 1, produto: 'Desinfetante', valor: 11.0 },
    { quantidade: 2, produto: 'Água Sanitária', valor: 7.0 },
    { quantidade: 6, produto: 'Laranja', valor: 13.0 },
    { quantidade: 4, produto: 'Banana', valor: 10.0 },
    { quantidade: 5, produto: 'Maçã', valor: 15.0 },
    { quantidade: 3, produto: 'Alface', valor: 6.0 },
    { quantidade: 1, produto: 'Tomate', valor: 4.0 },
    { quantidade: 3, produto: 'Cebola', valor: 5.0 },
    { quantidade: 2, produto: 'Batata', valor: 8.0 },
    { quantidade: 4, produto: 'Cenoura', valor: 9.0 },
    { quantidade: 2, produto: 'Pimentão', valor: 7.0 },
    { quantidade: 1, produto: 'Pepino', valor: 3.0 },
    { quantidade: 1, produto: 'Abobrinha', valor: 4.0 },
    { quantidade: 2, produto: 'Chuchu', valor: 3.0 },
    { quantidade: 2, produto: 'Repolho', valor: 6.0 },
    { quantidade: 3, produto: 'Milho', valor: 10.0 },
    { quantidade: 2, produto: 'Ervilha', valor: 7.0 },
    { quantidade: 2, produto: 'Amendoim', valor: 6.0 },
    { quantidade: 3, produto: 'Chocolate', valor: 18.0 },
    { quantidade: 1, produto: 'Bolacha', valor: 5.0 },
    { quantidade: 2, produto: 'Biscoito', valor: 4.0 },
    { quantidade: 4, produto: 'Cerveja', valor: 20.0 },
    { quantidade: 5, produto: 'Vinho', valor: 50.0 },
    { quantidade: 2, produto: 'Energético', valor: 22.0 },
    { quantidade: 1, produto: 'Iogurte', valor: 6.0 },
    { quantidade: 2, produto: 'Sorvete', valor: 15.0 },
  ];

  quantidadeVisivel = 6;

  sum(): number {
    return this.vendas.reduce((acc, item) => acc + item.valor, 0);
  }

  verMais(): void {
    this.quantidadeVisivel += 6;
  }
}
