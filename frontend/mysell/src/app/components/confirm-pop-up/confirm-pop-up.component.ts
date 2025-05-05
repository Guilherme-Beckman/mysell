import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-pop-up',
  templateUrl: './confirm-pop-up.component.html',
  styleUrls: ['./confirm-pop-up.component.scss'],
  imports: [CommonModule],
})
export class ConfirmPopUpComponent implements OnInit {
  @Input() isAtive: boolean = true;
  constructor() {}

  ngOnInit() {}
}
