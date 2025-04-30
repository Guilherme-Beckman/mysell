import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import {
  IonMenu,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import {
  MenuAction,
  MenuActionsComponent,
} from '../menu-actions/menu-actions.component';
@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss'],
  imports: [IonMenu, MenuActionsComponent],
})
export class MenuBarComponent implements OnInit {
  public email: string = '';
  menuActions: MenuAction[] = [
    {
      icon: 'assets/svg/analytics.svg',
      label: 'Análise de vendas',
      handler: () => console.log('Análise'),
    },

    {
      icon: 'assets/svg/add-product.svg',
      label: 'Adicionar Produto',
      handler: () => console.log('Add produto'),
    },
    {
      icon: 'assets/svg/history.svg',
      label: 'Histórico de vendas',
      handler: () => console.log('Histórico'),
    },
    {
      icon: 'assets/svg/report.svg',
      label: 'Relatório',
      handler: () => console.log('Relatório'),
    },
    {
      icon: 'assets/svg/help.svg',
      label: 'Ajuda',
      handler: () => console.log('Ajuda'),
    },
    {
      icon: 'assets/svg/logout.svg',
      label: 'Sair',
      handler: () => console.log('Sair'),
    },
  ];
  ngOnInit() {
    this.email = localStorage.getItem('email') || '';
  }
  constructor(private menu: MenuController, private router: Router) {}

  async open(route: string) {
    await this.menu.close('main-menu');
    this.router.navigate([route]);
  }
  onMenuAction(action: MenuAction) {
    // aqui você pode, por exemplo, navegar ou chamar serviços
    console.log('Clicou em', action.label);
  }
}
