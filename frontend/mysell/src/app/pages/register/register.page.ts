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
import { MessagePerRequestComponent } from 'src/app/components/message-per-request/message-per-request.component';
import { LoadingSppinerComponent } from 'src/app/components/loading-sppiner/loading-sppiner.component';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { EmailValidationService } from 'src/app/services/email-validation.service';
import { Validators } from '@angular/forms';

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
  public successMessage$ = this.messageService.successMessage$;
  public errorMessage$ = this.messageService.errorMessage$;
  public isLoading = false;
  public readonly emailToValidate = !!localStorage.getItem('emailToValidate');
  
  // Define form fields with validators in component
  public formFields = [
    { 
      name: 'email', 
      label: 'Email', 
      placeholder: '', 
      type: 'email', 
      validators: [
        Validators.required,
        Validators.email
      ] 
    },
    { 
      name: 'password', 
      label: 'Senha', 
      placeholder: '', 
      type: 'password', 
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d).+$')
      ] 
    },
    { 
      name: 'confirmPassword', 
      label: 'Confirmar Senha', 
      placeholder: '', 
      type: 'password', 
      validators: [Validators.required] 
    }
  ];

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private navController: NavController
  ) {}

  ngOnInit(): void {}

  public onRegister(event: { email: string; password: string; confirmPassword: string }): void {
    this.isLoading = true;
    this.clearLocalStorage();
    
    if (!(event.email && event.password && event.confirmPassword)) {
      this.messageService.setErrorMessage('Preencha todos os campos', '');
      this.isLoading = false;
      return;
    }
    
    // Only proceed if password and confirmPassword match
    if (event.password !== event.confirmPassword) {
      this.messageService.setErrorMessage('As senhas não coincidem', '');
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
        this.messageService.setErrorMessage('Email já cadastrado', '');
      },
    });
  }

  private clearLocalStorage(): void {
    localStorage.clear();
  }

  public async onGoogleRegister(): Promise<void> {
    await this.authService.onGoogleOAuth2();
  }

  public async onFacebookRegister(): Promise<void> {
    await this.authService.onFacebookOAuth2();
  }
}