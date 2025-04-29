import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { HomeNavComponent } from '../components/home-nav/home-nav.component';
import { SellsProfitInfoComponent } from '../components/sells-profit-info/sells-profit-info.component';
import { HomeActionsCarrouselComponent } from '../components/home-actions-carrousel/home-actions-carrousel.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    HomeNavComponent,
    SellsProfitInfoComponent,
    HomeActionsCarrouselComponent,
  ],
})
export class HomePage {
  constructor() {}

  ngOnInit() {}
}
