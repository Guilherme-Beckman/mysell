import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-per-request',
  templateUrl: './message-per-request.component.html',
  styleUrls: ['./message-per-request.component.scss'],
  imports: [CommonModule],
})
export class MessagePerRequestComponent implements OnInit {
  @Input() successMessage: string = '';
  @Input() errorMessage: string = '';
  constructor() {}

  ngOnInit() {}
}
