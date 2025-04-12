import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import {
  OrientationType,
  ScreenOrientation,
} from '@capawesome/capacitor-screen-orientation';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) this.router.navigate(['/home']);
    this.initializeApp();
    this.lockOrientation();
  }

  initializeApp() {
    //When the platform is ready, we can set up the deep link listener
    this.platform.ready().then(() => {
      // Listen for deep link events
      App.addListener('appUrlOpen', (event: { url: string }) => {
        this.handleDeepLink(event.url);
      });
    });
  }

  handleDeepLink(url: string) {
    // Check if this is our callback URL
    if (url.includes('mysell://callback')) {
      // Parse the URL to get the token
      const urlObj = new URL(url);
      const token = urlObj.searchParams.get('token');

      if (token) {
        // Save the token
        this.authService.saveToken(token);
        // Navigate to home
        this.router.navigate(['/home']);
      }
    }
  }
  private async lockOrientation(): Promise<void> {
    try {
      await ScreenOrientation.lock({ type: OrientationType.PORTRAIT });
    } catch (error) {
      // Opcional: log do erro para depuração
    }
  }
}
