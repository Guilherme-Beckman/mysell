import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-day-button',
  templateUrl: './day-button.component.html',
  styleUrls: ['./day-button.component.scss'],
  imports: [CommonModule],
})
export class DayButtonComponent implements OnInit {
  @Input() day: string = '';
  @Input() selected: boolean = false;
  constructor() {}

  ngOnInit() {}
}
