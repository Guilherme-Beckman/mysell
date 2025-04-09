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
  ],
})
export class RegisterPage implements OnInit {
  successMessage$;
  errorMessage$;
  isLoading = false;
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
    console.log(event);

    this.authService.register(event.email, event.password).subscribe({
      next: (next) => {
        this.isLoading = false;
        this.authService.saveToken(next.token);
        this.emailValidationService.sendEmailCode();
        this.messageService.setSuccessMessage(
          'Cadastro realizado com sucesso!',
          next
        );
        setTimeout(() => {
          this.navController.navigateRoot('/email-validation');
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.setErrorMessage(
          'Erro ao realizar cadastro!',
          error
        );
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  async onGoogleRegister(): Promise<void> {
    this.authService.onGoogleOAuth2();
  }

  async onFacebookRegister(): Promise<void> {
    this.authService.onFacebookOAuth2();
  }
}
