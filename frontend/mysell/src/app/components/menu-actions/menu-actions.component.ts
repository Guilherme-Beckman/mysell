// src/app/menu-actions/menu-actions.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonList, IonItem, IonIcon, IonLabel } from '@ionic/angular/standalone';
// src/app/menu-actions/menu-action.model.ts
export interface MenuAction {
  icon: string; // nome do ícone (Ionicons ou Remix Icons)
  label: string; // texto exibido
  handler?: () => void; // função opcional ao clicar
}

@Component({
  selector: 'app-menu-actions',
  templateUrl: './menu-actions.component.html',
  styleUrls: ['./menu-actions.component.scss'],
  standalone: true,
  imports: [CommonModule, IonList, IonItem, IonIcon, IonLabel],
})
export class MenuActionsComponent implements OnInit {
  @Input() actions: MenuAction[] = [];
  @Output() actionSelected = new EventEmitter<MenuAction>();

  ngOnInit() {}

  onClick(action: MenuAction) {
    if (action.handler) {
      action.handler();
    }
    this.actionSelected.emit(action);
  }
}
