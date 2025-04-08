import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-eye-svg',
  templateUrl: './eye-svg.component.html',
  styleUrls: ['./eye-svg.component.scss'],
  imports: [CommonModule],
})
export class EyeSvgComponent {
  @Input() isEyeOpen: boolean = false;
  @Output() toggle: EventEmitter<void> = new EventEmitter<void>();

  onToggle(): void {
    this.toggle.emit();
  }
}
