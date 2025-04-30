import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import {
  IonApp,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
  imports: [IonContent, IonHeader, IonMenu, IonTitle, IonToolbar],
})
export class MenuBarComponent implements OnInit {
  ngOnInit() {}
  constructor(private menu: MenuController, private router: Router) {}

  async open(route: string) {
    await this.menu.close('main-menu');
    this.router.navigate([route]);
  }
}
