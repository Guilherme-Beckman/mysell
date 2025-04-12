import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthFormComponent } from 'src/app/components/auth-form/auth-form.component';
import { MessageService } from 'src/app/services/message.service';
import { MessagePerRequestComponent } from 'src/app/components/message-per-request/message-per-request.component';
import { LoadingSppinerComponent } from 'src/app/components/loading-sppiner/loading-sppiner.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { EmailValidationService } from 'src/app/services/email-validation.service';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AuthFormComponent,
    MessagePerRequestComponent,
    LoadingSppinerComponent,
    ArrowComponent,
  ],
})
export class RegisterPage implements OnInit {
  successMessage$;
  errorMessage$;
  isLoading = false;
  readonly emailToValidate = !!localStorage.getItem('emailToValidate');

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private navController: NavController, // injetando o NavController
    private emailValidationService: EmailValidationService
  ) {
    this.successMessage$ = this.messageService.successMessage$;
    this.errorMessage$ = this.messageService.errorMessage$;
  }

  ngOnInit() {}

  onRegister(event: { email: string; password: string }): void {
    this.isLoading = true;
    this.clearLocalStorage();
    if (!(event.email || event.password)) {
      this.messageService.setErrorMessage('Preencha todos os campos', '');
      this.isLoading = false;
      return;
    }
    this.authService.verifyIfUserAlreadyExists(event.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageService.setSuccessMessage(
          'Cadastro realizado com sucesso!',
          ''
        );
        setTimeout(() => {
          this.navController.navigateRoot('/email-validation', {
            queryParams: { email: event.email, password: event.password },
          });
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;

        console.log(error);
        this.messageService.setErrorMessage('Email já cadastrado', '');
      },
    });
  }
  private clearLocalStorage(): void {
    localStorage.clear();
  }

  async onGoogleRegister(): Promise<void> {
    this.authService.onGoogleOAuth2();
  }

  async onFacebookRegister(): Promise<void> {
    this.authService.onFacebookOAuth2();
  }
}
