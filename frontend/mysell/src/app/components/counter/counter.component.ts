import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})
export class CounterComponent {
  /** Valor atual */
  @Input() count = 1;
  /** Valor mínimo permitido */
  @Input() min = 1;
  /** Valor máximo permitido */
  @Input() max = Infinity;
  /** Desabilita todo o controle */
  @Input() disabled = true;
  /** Emite sempre que o count mudar */
  @Output() countChange = new EventEmitter<number>();

  decrement(): void {
    if (this.disabled) {
      return;
    }
    const next = this.count - 1;
    if (next >= this.min) {
      this.count = next;
      this.countChange.emit(this.count);
    }
  }

  increment(): void {
    if (this.disabled) {
      return;
    }
    const next = this.count + 1;
    if (next <= this.max) {
      this.count = next;
      this.countChange.emit(this.count);
    }
  }
}
