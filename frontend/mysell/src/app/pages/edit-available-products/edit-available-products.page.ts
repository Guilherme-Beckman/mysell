import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { EditProductFormComponent } from 'src/app/components/edit-product-form/edit-product-form.component';
import { HomeRedirectComponent } from 'src/app/components/home-redirect/home-redirect.component';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
import { BottomArrowComponent } from 'src/app/components/bottom-arrow/bottom-arrow.component';

@Component({
  selector: 'app-edit-available-products',
  templateUrl: './edit-available-products.page.html',
  styleUrls: ['./edit-available-products.page.scss'],
  standalone: true,
  imports: [
    EditProductFormComponent,
    HomeRedirectComponent,
    ArrowComponent,
    BottomArrowComponent,
  ],
})
export class EditAvailableProductsPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
