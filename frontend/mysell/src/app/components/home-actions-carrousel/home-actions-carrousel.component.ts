import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

export interface ActionButton {
  svgPath: string;
  label: string;
  route: string;
  cssClass?: string;
}
@Component({
  selector: 'app-home-actions-carrousel',
  templateUrl: './home-actions-carrousel.component.html',
  styleUrls: ['./home-actions-carrousel.component.scss'],
  imports: [CommonModule],
})
export class HomeActionsCarrouselComponent implements OnInit {
  @Input() actions: ActionButton[] = [];
  ngOnInit(): void {}
  constructor(private navController: NavController) {}

  onAction(action: ActionButton) {
    if (action.route) {
      this.navController.navigateRoot(action.route);
    }
  }
}
