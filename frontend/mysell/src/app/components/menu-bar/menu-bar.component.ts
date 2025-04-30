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
      icon: 'bar-chart-outline',
      label: 'Análise de vendas',
      handler: () => console.log('Análise'),
    },
    {
      icon: 'contrast-outline',
      label: 'Alterar tema',
      handler: () => console.log('Tema'),
    },
    {
      icon: 'add-circle-outline',
      label: 'Adicionar Produto',
      handler: () => console.log('Add produto'),
    },
    {
      icon: 'time-outline',
      label: 'Histórico de vendas',
      handler: () => console.log('Histórico'),
    },
    {
      icon: 'document-text-outline',
      label: 'Relatório',
      handler: () => console.log('Relatório'),
    },
    {
      icon: 'help-circle-outline',
      label: 'Ajuda',
      handler: () => console.log('Ajuda'),
    },
    {
      icon: 'log-out-outline',
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
