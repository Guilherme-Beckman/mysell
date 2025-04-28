import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';

export interface ActionButton {
  icon: string; // Exemplo: 'arrow-up-circle-outline'
  label: string; // Exemplo: 'Vender'
  route: string; // Exemplo: '/vendas'
  cssClass?: string; // Classe CSS opcional para customização
}
@Component({
  selector: 'app-home-actions-carrousel',
  templateUrl: './home-actions-carrousel.component.html',
  styleUrls: ['./home-actions-carrousel.component.scss'],
  imports: [IonIcon, CommonModule],
})
export class HomeActionsCarrouselComponent implements OnInit {
  @Input() actions: ActionButton[] = [];
  ngOnInit(): void {}
  constructor(private router: Router) {}

  onAction(action: ActionButton) {
    if (action.route) {
      this.router.navigateByUrl(action.route);
    }
  }
}
