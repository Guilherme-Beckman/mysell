import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { O } from '@angular/router/router_module.d-6zbCxc1T';

@Component({
  selector: 'app-day-button',
  templateUrl: './day-button.component.html',
  styleUrls: ['./day-button.component.scss'],
  imports: [CommonModule],
})
export class DayButtonComponent implements OnInit {
  @Input() day: number = 0;
  @Input() selected: boolean = true;
  @Output() daySelected = new EventEmitter<number>();
  constructor() {}

  ngOnInit() {}
  onClick(): void {
    this.daySelected.emit(this.day);
  }
}
