import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home-redirect',
  templateUrl: './home-redirect.component.html',
  styleUrls: ['./home-redirect.component.scss'],
})
export class HomeRedirectComponent implements OnInit {
  private homePath = '/home';
  constructor(private navController: NavController) {}

  ngOnInit() {}
  redirectToHome(): void {
    this.navController.navigateRoot(this.homePath);
  }
}
