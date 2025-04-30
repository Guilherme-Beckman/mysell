import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonItem } from '@ionic/angular/standalone';
import { IonMenu, IonList, IonIcon, IonLabel } from '@ionic/angular/standalone';
// menu-action.model.ts
export interface MenuAction {
  icon: string; // nome do ícone (pode ser do Ionicons ou Remix Icons)
  label: string; // texto que aparece no menu
  handler?: () => void; // função opcional a ser executada ao clicar
}

@Component({
  selector: 'app-menu-actions',
  templateUrl: './menu-actions.component.html',
  styleUrls: ['./menu-actions.component.scss'],
  imports: [IonList, IonItem, IonIcon, IonLabel, CommonModule],
})
export class MenuActionsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  @Input() actions: MenuAction[] = [];
  @Output() actionSelected = new EventEmitter<MenuAction>();

  onClick(action: MenuAction) {
    if (action.handler) {
      action.handler();
    }
    this.actionSelected.emit(action);
  }
}
