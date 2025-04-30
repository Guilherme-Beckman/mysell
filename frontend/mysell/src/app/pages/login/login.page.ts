import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthFormComponent } from 'src/app/components/auth-form/auth-form.component';
import { MessagePerRequestComponent } from 'src/app/components/message-per-request/message-per-request.component';
import { LoadingSppinerComponent } from 'src/app/components/loading-sppiner/loading-sppiner.component';

import { MessageService } from 'src/app/services/message.service';
import { AuthService } from 'src/app/services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AuthFormComponent,
    MessagePerRequestComponent,
    LoadingSppinerComponent,
  ],
})
export class LoginPage implements OnInit {
  public formFields = [
    {
      name: 'email',
      label: 'Email',
      placeholder: '',
      type: 'email',
      validators: [Validators.required, Validators.email],
    },
    {
      name: 'password',
      label: 'Senha',
      placeholder: '',
      type: 'password',
      validators: [Validators.required],
    },
  ];
  public successMessage$ = this.messageService.successMessage$;
  public errorMessage$ = this.messageService.errorMessage$;
  public isLoading = false;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private navController: NavController
  ) {}

  ngOnInit(): void {}

  public onLogin(event: { email: string; password: string }): void {
    this.isLoading = true;
    if (!(event.email || event.password)) {
      this.messageService.setErrorMessage('Preencha todos os campos', '');
      this.isLoading = false;
      return;
    }

    this.authService
      .login(event.email, event.password)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          this.authService.saveEmail(response.email);

          this.messageService.setSuccessMessage(
            'Login realizado com sucesso!',
            response
          );
          setTimeout(() => {
            this.navController.navigateRoot(['/home']);
          }, 2000);
        },
        error: (error) => {
          this.messageService.setErrorMessage('Erro ao realizar login!', error);
        },
      });
  }

  public async onGoogleLogin(): Promise<void> {
    await this.authService.onGoogleOAuth2();
  }

  public async onFacebookLogin(): Promise<void> {
    await this.authService.onFacebookOAuth2();
  }
}
