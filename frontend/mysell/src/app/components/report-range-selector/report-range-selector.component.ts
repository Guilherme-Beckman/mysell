import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DayButtonComponent } from '../day-button/day-button.component';

@Component({
  selector: 'app-report-range-selector',
  templateUrl: './report-range-selector.component.html',
  styleUrls: ['./report-range-selector.component.scss'],
  imports: [CommonModule, DayButtonComponent],
})
export class ReportRangeSelectorComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
