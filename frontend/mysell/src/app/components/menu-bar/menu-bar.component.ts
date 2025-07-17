import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { IonMenu } from '@ionic/angular/standalone';
import {
  MenuAction,
  MenuActionsComponent,
} from '../menu-actions/menu-actions.component';
import { ConfirmPopUpComponent } from '../confirm-pop-up/confirm-pop-up.component';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
  imports: [IonMenu, MenuActionsComponent, ConfirmPopUpComponent],
})
export class MenuBarComponent implements OnInit {
  public email: string = '';
  public isConfirmPopupOpen = false;
  menuActions: MenuAction[] = [
    {
      icon: 'assets/svg/analytics.svg',
      label: 'Análise de vendas',
      handler: () => this.navController.navigateRoot('/analytics'),
    },
    {
      icon: 'assets/svg/product-svgrepo-com.svg',
      label: 'Seus produtos',
      handler: () => this.navController.navigateRoot('/your-products'),
    },
    {
      icon: 'assets/svg/add-product.svg',
      label: 'Adicionar Produto',
      handler: () => this.navController.navigateRoot('/create-products'),
    },
    {
      icon: 'assets/svg/history.svg',
      label: 'Histórico de vendas',
      handler: () => this.navController.navigateRoot('/history'),
    },
    {
      icon: 'assets/svg/report.svg',
      label: 'Relatório',
      handler: () => this.navController.navigateRoot('/analytics'), // ajuste se tiver rota específica
    },
    {
      icon: 'assets/svg/help.svg',
      label: 'Ajuda',
      handler: () => this.navController.navigateRoot('/help'), // ajuste se tiver rota específica
    },
    {
      icon: 'assets/svg/logout.svg',
      label: 'Sair',
      handler: () => (this.isConfirmPopupOpen = true),
    },
  ];

  constructor(
    private menu: MenuController,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
  }

  async navigateTo(route: string) {
    await this.menu.close('main-menu');
    // navegação usando NavController para animação padrão Ionic
    this.navController.navigateForward(route);
  }

  logout() {
    // Lógica de logout, por exemplo limpar token, localStorage
    localStorage.clear();
    this.menu.close('main-menu');
    this.navController.navigateRoot('/login');
  }
  confirmLogout() {
    this.isConfirmPopupOpen = false;
    localStorage.clear();
    this.navController.navigateRoot('/login');
  }
}
