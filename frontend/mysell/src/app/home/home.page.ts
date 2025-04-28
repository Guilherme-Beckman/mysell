import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { HomeNavComponent } from '../components/home-nav/home-nav.component';
import { SellsProfitInfoComponent } from '../componets/sells-profit-info/sells-profit-info.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [HomeNavComponent, SellsProfitInfoComponent],
})
export class HomePage {
  constructor() {}

  ngOnInit() {  
  }
}
