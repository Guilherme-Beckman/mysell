import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular/standalone';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
import { HomeRedirectComponent } from 'src/app/components/home-redirect/home-redirect.component';
import { ProguessBarComponent } from 'src/app/components/proguess-bar/proguess-bar.component';
import { BottomArrowComponent } from 'src/app/components/bottom-arrow/bottom-arrow.component';
import { ConfirmButtonComponent } from 'src/app/components/confirm-button/confirm-button.component';
export interface Product {
  id: number;
  name: string;
  iconUrl: string; // caminho para o SVG ou PNG do ícone
}

@Component({
  selector: 'app-selected-products',
  templateUrl: './selected-products.page.html',
  styleUrls: ['./selected-products.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ArrowComponent,
    HomeRedirectComponent,
    ProguessBarComponent,
    BottomArrowComponent,
    ConfirmButtonComponent,
  ],
})
export class SelectedProductsPage implements OnInit {
  @Input() products: Product[] = [
    {
      id: 1,
      name: 'Arroz',
      iconUrl: 'assets/svg/categories/beauty-cream-icon.svg',
    },
    {
      id: 2,
      name: 'Skol',
      iconUrl: 'assets/svg/categories/food-icon.svg',
    },
    { id: 3, name: 'Câmera', iconUrl: 'assets/svg/categories/camera-icon.svg' },
    {
      id: 4,
      name: 'Edifício',
      iconUrl: 'assets/svg/categories/building-icon.svg',
    },
    {
      id: 5,
      name: 'Pincel',
      iconUrl: 'assets/svg/categories/brush-pencil-icon.svg',
    },
    {
      id: 5,
      name: 'Pincel',
      iconUrl: 'assets/svg/categories/brush-pencil-icon.svg',
    },
    {
      id: 5,
      name: 'Pincel',
      iconUrl: 'assets/svg/categories/brush-pencil-icon.svg',
    },
    {
      id: 5,
      name: 'Pincel',
      iconUrl: 'assets/svg/categories/brush-pencil-icon.svg',
    },
    {
      id: 5,
      name: 'Pincel',
      iconUrl: 'assets/svg/categories/brush-pencil-icon.svg',
    },
    {
      id: 5,
      name: 'Pincel',
      iconUrl: 'assets/svg/categories/brush-pencil-icon.svg',
    },
    {
      id: 5,
      name: 'Pincel',
      iconUrl: 'assets/svg/categories/brush-pencil-icon.svg',
    },
    {
      id: 5,
      name: 'Pincel',
      iconUrl: 'assets/svg/categories/brush-pencil-icon.svg',
    },
    {
      id: 5,
      name: 'Pincel',
      iconUrl: 'assets/svg/categories/brush-pencil-icon.svg',
    },
    {
      id: 5,
      name: 'Pincel',
      iconUrl: 'assets/svg/categories/brush-pencil-icon.svg',
    },
    {
      id: 5,
      name: 'Pincel',
      iconUrl: 'assets/svg/categories/brush-pencil-icon.svg',
    },
    {
      id: 5,
      name: 'Pincel',
      iconUrl: 'assets/svg/categories/brush-pencil-icon.svg',
    },
    {
      id: 5,
      name: 'Pincel',
      iconUrl: 'assets/svg/categories/brush-pencil-icon.svg',
    },
    {
      id: 5,
      name: 'Pincel',
      iconUrl: 'assets/svg/categories/brush-pencil-icon.svg',
    },
  ];
  @Output() remove = new EventEmitter<Product>();

  onRemove(product: Product) {
    this.remove.emit(product);
  }
  proguess() {
    return 50;
  }
  constructor(private navController: NavController) {}

  ngOnInit() {}
  trackById(index: number, item: Product) {
    return item.id;
  }
  public redirectBack() {
    this.navController.navigateRoot('/edit-available-products');
  }
}
