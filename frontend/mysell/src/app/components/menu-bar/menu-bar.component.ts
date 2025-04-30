import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { IonMenu } from '@ionic/angular/standalone';
@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
  imports: [IonMenu],
})
export class MenuBarComponent implements OnInit {
  public email: string = '';
  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
  }
  constructor(private menu: MenuController, private router: Router) {}

  async open(route: string) {
    await this.menu.close('main-menu');
    this.router.navigate([route]);
  }
}
