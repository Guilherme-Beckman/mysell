import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { HomeNavComponent } from '../components/home-nav/home-nav.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, HomeNavComponent],
})
export class HomePage {
  constructor() {}

  ngOnInit() {  
  }
}
