import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
export interface AddProductButton {
  svgPath: string;
  text: string;
  action: () => void;
}
@Component({
  selector: 'app-add-product-buttons',
  templateUrl: './add-product-buttons.component.html',
  styleUrls: ['./add-product-buttons.component.scss'],
  imports: [CommonModule],
})
export class AddProductButtonsComponent implements OnInit {
  @Input() buttons: AddProductButton[] = [];
  constructor() {}

  ngOnInit() {}
}
