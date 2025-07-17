import { Component, OnInit } from '@angular/core';
import {
  IonSearchbar,
  IonMenuButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.scss'],
  imports: [IonSearchbar, IonMenuButton, IonButtons],
})
export class HomeNavComponent implements OnInit {
  constructor(private menuController: MenuController) {}

  ngOnInit() {}
}
