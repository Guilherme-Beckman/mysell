import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { BottomArrowComponent } from '../bottom-arrow/bottom-arrow.component';

Chart.register(...registerables);

export interface Product {
  name: string;
  sales: number;
}
@Component({
  selector: 'app-pizza-graph',
  templateUrl: './pizza-graph.component.html',
  styleUrls: ['./pizza-graph.component.scss'],
  imports: [CommonModule, BottomArrowComponent],
})
export class PizzaGraphComponent implements OnInit {
  @Input() isExpanded = false;
  @Input() products: Product[] = [];
  @Output() expand = new EventEmitter<void>();
  @Output() closeInfoEvent = new EventEmitter<void>();
  @Input() isLoading = false;
  @ViewChild('chartCanvas', { static: true })
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  ngOnInit() {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['products'] && !changes['products'].firstChange) {
      this.updateChart();
    }
  }
  public expandInfo() {
    this.expand.emit();
    this.updateChart(); // Atualiza o gráfico após expandir ou recolher
  }
  public closeInfo() {
    this.closeInfoEvent.emit();
    this.updateChart(); // Atualiza o gráfico após expandir ou recolher
  }
  private createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: this.products.map((p) => p.name), // SEMPRE mostra os labels
        datasets: [
          {
            data: this.products.map((p) => p.sales),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#FF6384',
              '#C9CBCF',
            ],
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: this.isExpanded, // <- aqui está o segredo
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
            },
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }
  private updateChart() {
    if (!this.chart) return;

    this.chart.data.labels = this.products.map((p) => p.name);
    this.chart.data.datasets[0].data = this.products.map((p) => p.sales);

    // Atualiza exibição da legenda
    this.chart.options.plugins!.legend!.display = this.isExpanded;

    this.chart.update();
  }
}
