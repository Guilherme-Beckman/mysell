import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonNav,
} from '@ionic/angular/standalone';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';

@Component({
  selector: 'app-create-products',
  templateUrl: './create-products.page.html',
  styleUrls: ['./create-products.page.scss'],
  standalone: true,
  imports: [IonNav, CommonModule, FormsModule, ArrowComponent],
})
export class CreateProductsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
