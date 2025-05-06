import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-selected-products',
  templateUrl: './selected-products.page.html',
  styleUrls: ['./selected-products.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SelectedProductsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
