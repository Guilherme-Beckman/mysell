import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { IonContent } from '@ionic/angular/standalone';
import { HomeNavComponent } from '../components/home-nav/home-nav.component';
import { SellsProfitInfoComponent } from '../components/sells-profit-info/sells-profit-info.component';
import { HomeActionsCarrouselComponent } from '../components/home-actions-carrousel/home-actions-carrousel.component';
import { HomeLastSellsComponent } from '../components/home-last-sells/home-last-sells.component';
import { MenuBarComponent } from '../components/menu-bar/menu-bar.component';
import { MenuController } from '@ionic/angular';

import { IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonApp,
    HomeNavComponent,
    SellsProfitInfoComponent,
    HomeActionsCarrouselComponent,
    HomeLastSellsComponent,
    IonContent,
    MenuBarComponent,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class HomePage {
  constructor(private menu: MenuController) {}

  ngOnInit() {}

  doRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
      window.location.reload();
    }, 500);
  }
  ionViewWillEnter() {
    this.menu.enable(true, 'main-menu');
  }

  // ao sair da Home, desabilita o menu
  ionViewDidLeave() {
    this.menu.enable(false, 'main-menu');
  }
}
