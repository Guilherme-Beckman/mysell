import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

import { environment } from 'src/environments/environment.prod';

// Components
import { CodeSquaresComponent } from 'src/app/components/code-squares/code-squares.component';
import { MessagePerRequestComponent } from 'src/app/components/message-per-request/message-per-request.component';
import { LoadingSppinerComponent } from 'src/app/components/loading-sppiner/loading-sppiner.component';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';

// Services
import {
  EmailValidationService,
  EmailCodeResponse,
} from 'src/app/services/email-validation.service';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from 'src/app/services/auth.service';

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
    ArrowComponent,
  ],
})
export class EmailValidationPage implements OnInit {
  public email: string = '';
  public countdown!: number;
  public isLoading = false;
  public errorMessage$ = this.messageService.errorMessage$;
  public successMessage$ = this.messageService.successMessage$;

  private readonly apiUrl: string = environment.apiUrl;
  private countdownInterval: any;
  private password: string = '';

  constructor(
    private navController: NavController,
    private emailValidationService: EmailValidationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.initializeEmailAndPassword();
    this.handleInitialCodeSending();
  }

  public validateCode(code: string): void {
    this.isLoading = true;
    this.emailValidationService
      .verifyEmailCode(this.email, this.password, code)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => this.handleSuccessfulValidation(response),
        error: (error) => this.handleValidationError(error),
      });
  }

  public resendCode(): void {
    console.log('[EmailValidation] Resending verification code...');
    this.isLoading = true;
    this.emailValidationService
      .sendEmailCode(this.email)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => this.handleResendSuccess(response),
        error: (error) => this.handleValidationError(error),
      });
  }

  private initializeEmailAndPassword(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email') || localStorage.getItem('email') || '';
      this.password = params.get('password') || localStorage.getItem('password') || '';
      this.persistCredentials();
    });
  }

  private handleInitialCodeSending(): void {
    const hasValidationSession = localStorage.getItem('emailToValidate');
    hasValidationSession ? this.loadCodeWithTimer() : this.sendInitialCode();
  }

  private sendInitialCode(): void {
    console.log('[EmailValidation] Sending initial verification code');
    this.markValidationSession();
    this.emailValidationService.sendEmailCode(this.email).subscribe({
      next: (response) => this.handleInitialCodeSuccess(response),
      error: (error) => this.handleValidationError(error),
    });
  }

  private handleSuccessfulValidation(response: any): void {
    this.authService.saveToken(response.token);
    this.messageService.setSuccessMessage('Verificação realizada com sucesso!', response);
    this.cleanUpAfterValidation();
    setTimeout(() => this.navigateToHome(), 2000);
  }

  private handleResendSuccess(response: EmailCodeResponse): void {
    this.messageService.setSuccessMessage('Código de verificação enviado com sucesso!', '');
    this.updateCountdown(response.timeValidCode);
    this.persistResendTimestamp();
    this.loadCodeWithTimer();
  }

  private handleInitialCodeSuccess(response: EmailCodeResponse): void {
    this.updateCountdown(response.timeValidCode);
    this.loadCodeWithTimer();
  }

  private handleValidationError(error: any): void {
    this.messageService.setErrorMessage('', error);
  }

  private loadCodeWithTimer(): void {
    this.initializeCountdownFromStorage();
    const remainingTime = this.calculateRemainingTime();
    this.adjustCountdown(remainingTime);
    this.startCountdownIfNeeded();
  }

  private initializeCountdownFromStorage(): void {
    const storedCountdown = localStorage.getItem('countdown');
    if (storedCountdown) {
      this.countdown = Number(storedCountdown);
    }
  }

  private calculateRemainingTime(): number {
    const lastSendTimestamp = this.getLastSendTimestamp();
    const elapsedTime = Date.now() - lastSendTimestamp;
    return Math.max(0, (this.countdown * 1000) - elapsedTime);
  }

  private getLastSendTimestamp(): number {
    const lastSend = localStorage.getItem('lastSend');
    if (!lastSend) {
      const currentTimestamp = Date.now();
      localStorage.setItem('lastSend', currentTimestamp.toString());
      return currentTimestamp;
    }
    return Number(lastSend);
  }

  private adjustCountdown(remainingTime: number): void {
    if (remainingTime < 1500) {
      this.countdown = 0;
    } else {
      this.countdown = Math.floor(remainingTime / 1000);
    }
  }

  private startCountdownIfNeeded(): void {
    if (this.countdown > 0) {
      this.startCountdown();
    }
  }

  private startCountdown(): void {
    this.clearExistingCountdown();
    console.log(`[EmailValidation] Starting countdown: ${this.countdown} seconds`);

    this.countdownInterval = setInterval(() => {
      this.countdown > 0 ? this.countdown-- : this.clearExistingCountdown();
    }, 1000);
  }

  private clearExistingCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  private persistCredentials(): void {
    localStorage.setItem('email', this.email);
    localStorage.setItem('password', this.password);
  }

  private persistResendTimestamp(): void {
    localStorage.setItem('lastSend', Date.now().toString());
  }

  private markValidationSession(): void {
    localStorage.setItem('emailToValidate', 'true');
  }

  private cleanUpAfterValidation(): void {
    localStorage.removeItem('emailToValidate');
    localStorage.removeItem('password');
  }

  private navigateToHome(): void {
    this.navController.navigateRoot('/home');
  }

  private updateCountdown(timeInSeconds: number): void {
    this.countdown = timeInSeconds;
    localStorage.setItem('countdown', timeInSeconds.toString());
  }
}