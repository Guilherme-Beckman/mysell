import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home-redirect',
  templateUrl: './home-redirect.component.html',
  styleUrls: ['./home-redirect.component.scss'],
})
export class HomeRedirectComponent implements OnInit {
  @Input() emitOnly = false; // se true, apenas emite o evento
  @Output() requestNavigationBack = new EventEmitter<void>();

  private homePath = '/home';

  constructor(private navController: NavController) {}

  ngOnInit() {}

  onClick(): void {
    if (this.emitOnly) {
      this.requestNavigationBack.emit();
    } else {
      this.navController.navigateRoot(this.homePath);
    }
  }
}
