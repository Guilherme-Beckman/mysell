import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DayButtonComponent } from '../day-button/day-button.component';

@Component({
  selector: 'app-report-range-selector',
  templateUrl: './report-range-selector.component.html',
  styleUrls: ['./report-range-selector.component.scss'],
  imports: [CommonModule, DayButtonComponent],
})
export class ReportRangeSelectorComponent implements OnInit {
  public dayOptions: number[] = [1, 7];
  public selectedDay: number = 1;
  @Output() daySelected = new EventEmitter<number>();
  constructor() {}

  onDaySelected(day: number) {
    this.selectedDay = day;
    this.daySelected.emit(day);
  }
  ngOnInit() {}
}
