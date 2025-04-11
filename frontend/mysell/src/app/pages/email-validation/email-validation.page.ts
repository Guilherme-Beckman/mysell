import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

import { environment } from 'src/environments/environment.prod';

import { CodeSquaresComponent } from 'src/app/components/code-squares/code-squares.component';
import { MessagePerRequestComponent } from 'src/app/components/message-per-request/message-per-request.component';
import { LoadingSppinerComponent } from 'src/app/components/loading-sppiner/loading-sppiner.component';

import {
  EmailValidationService,
  EmailCodeResponse,
} from 'src/app/services/email-validation.service';
import { MessageService } from 'src/app/services/message.service';

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
  private readonly apiUrl: string = environment.apiUrl;
  private readonly timeToUserResendCode: number = 60000; // 1 minuto

  public email: string = '';
  public countdown!: number;
  public isLoading: boolean = false;
  public errorMessage$;
  public successMessage$;

  private interval: any;

  constructor(
    private emailValidationService: EmailValidationService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.errorMessage$ = this.messageService.errorMessage$;
    this.successMessage$ = this.messageService.successMessage$;
  }

  public ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email') || '';
    });

    if (!localStorage.getItem('emailToValidate')) {
      this.sendCode();
    } else {
      this.loadCodeWithTimer();
    }
  }

  public getCode(event: string): void {
    this.isLoading = true;

    this.emailValidationService.verifyEmailCode(event).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.messageService.setSuccessMessage(
          'Código de verificação enviado com sucesso!',
          response
        );
        this.removeValidationSession();
      },
      error: (error) => {
        this.isLoading = false;
        this.messageService.setErrorMessage('', error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  public resendCode(): void {
    this.isLoading = true;

    this.emailValidationService.sendEmailCode().subscribe({
      next: (response: EmailCodeResponse) => {
        this.messageService.setSuccessMessage(
          'Código de verificação enviado com sucesso!',
          ''
        );
        this.countdown = response.timeValidCode;
        this.startCountdown();
        localStorage.setItem('lastSend', Date.now().toString());
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.setErrorMessage('', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private sendCode(): void {
    this.initValidationSession();

    this.emailValidationService.sendEmailCode().subscribe({
      next: (response: EmailCodeResponse) => {
        this.countdown = response.timeValidCode;
        this.startCountdown();
      },
      error: (error) => {
        this.messageService.setErrorMessage('', error);
      },
    });
  }

  private startCountdown(): void {
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

  private loadCodeWithTimer(): void {
    const lastSendFromStorage = localStorage.getItem('lastSend');
    if (!lastSendFromStorage) {
      const currentTimestamp = Date.now().toString();
      localStorage.setItem('lastSend', currentTimestamp);
    }

    const lastSend = Number(localStorage.getItem('lastSend'));
    const now = Date.now();
    const elapsedTime = now - lastSend;
    let remaining = this.timeToUserResendCode - elapsedTime;

    if (remaining < 0) {
      remaining = 0;
    }

    this.countdown = remaining < 1500 ? 0 : Math.floor(remaining / 1000);
    if (this.countdown > 0) {
      this.startCountdown();
    }
  }

  private initValidationSession(): void {
    localStorage.setItem('emailToValidate', 'true');
  }

  private removeValidationSession(): void {
    localStorage.removeItem('emailToValidate');
  }
}
