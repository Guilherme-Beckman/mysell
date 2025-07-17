import { Component } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  MenuController,
} from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import {
  OrientationType,
  ScreenOrientation,
} from '@capawesome/capacitor-screen-orientation';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, MenuBarComponent],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private menu: MenuController
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
    this.initializeApp();
    this.lockOrientation();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      App.addListener('appUrlOpen', (event: { url: string }) => {
        this.handleDeepLink(event.url);
      });
    });
  }

  handleDeepLink(url: string) {
    if (url.includes('mysell://callback')) {
      const token = new URL(url).searchParams.get('token');
      if (token) {
        this.authService.saveToken(token);
        this.router.navigate(['/home']);
      }
    }
  }

  private async lockOrientation(): Promise<void> {
    try {
      await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
    } catch {}
  }

  public formatBigNumber(value: number): string {
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + 'M';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(1) + 'K';
    } else if (value > 9999) {
      return '...';
    }
    return value.toString();
  }
}
