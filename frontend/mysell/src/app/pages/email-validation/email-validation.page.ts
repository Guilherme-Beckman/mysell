import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CodeSquaresComponent } from 'src/app/components/code-squares/code-squares.component';
import { EmailValidationService } from 'src/app/services/email-validation.service';
import { environment } from 'src/environments/environment.prod';
import { MessageService } from 'src/app/services/message.service';
import { MessagePerRequestComponent } from 'src/app/components/message-per-request/message-per-request.component';
import { LoadingSppinerComponent } from 'src/app/components/loading-sppiner/loading-sppiner.component';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-email-validation',
  templateUrl: './email-validation.page.html',
  styleUrls: ['./email-validation.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CodeSquaresComponent,
    MessagePerRequestComponent,
    LoadingSppinerComponent,
  ],
})
export class EmailValidationPage implements OnInit {
  private readonly apiUrl = environment.apiUrl;
  email: string = '';
  countdown: number = 60;
  timeToUserResendCode = 60000; // 1 minute
  private interval: any;
  sendCodeLink = `${this.apiUrl}auth/sendCode`;
  errorMessage$;
  successMessage$;
  isLoading = false;

  constructor(
    private emailValidationService: EmailValidationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.errorMessage$ = this.messageService.errorMessage$;
    this.successMessage$ = this.messageService.successMessage$;
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email') || '';
    });

    this.loadCodeWithTimer();
  }

  loadCodeWithTimer(): void {
    this.initValidationSession();
    this.emailValidationService.sendEmailCode().subscribe({
      next: (duration) => {
        this.countdown = parseInt(duration, 10);
        this.startCountdown();
      },
      error: (error) => {},
    });
  }
  private initValidationSession(): void {
    localStorage.setItem('emailToValidate', 'true');
  }
  private removeValidationSession(): void {
    localStorage.removeItem('emailToValidate');
  }

  startCountdown(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  getCode(event: string) {
    this.isLoading = true;
    if (!this.userCanResendCode) return;

    this.emailValidationService.verifyEmailCode(event).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.messageService.setSuccessMessage(
          'Código de verificação enviado com sucesso!',
          response
        );
        this.removeValidationSession();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.messageService.setErrorMessage(
          'Erro ao enviar o código de verificação.',
          error
        );
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  private userCanResendCode(): boolean {
    const now = Date.now();
    const lastSend = Number(localStorage.getItem('lastSend'));
    if (lastSend && now - lastSend < this.timeToUserResendCode) {
      return false;
    }
    return true;
  }
  resendCode() {}
}
