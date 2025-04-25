import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';

import { CodeSquaresComponent } from 'src/app/components/code-squares/code-squares.component';
import { MessagePerRequestComponent } from 'src/app/components/message-per-request/message-per-request.component';
import { LoadingSppinerComponent } from 'src/app/components/loading-sppiner/loading-sppiner.component';
import { ArrowComponent } from 'src/app/components/arrow/arrow.component';

import {
  EmailValidationService,
  EmailCodeResponse,
} from 'src/app/services/email-validation.service';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from 'src/app/services/auth.service';
import { finalize } from 'rxjs/operators';

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
  private readonly apiUrl: string = environment.apiUrl;
  public email: string = '';
  public countdown!: number;
  public isLoading = false;
  public errorMessage$ = this.messageService.errorMessage$;
  public successMessage$ = this.messageService.successMessage$;

  private interval: any;
  private password: string = '';

  constructor(
    private navController: NavController,
    private emailValidationService: EmailValidationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email') || localStorage.getItem('email') || '';
      this.password =
        params.get('password') || localStorage.getItem('password') || '';
      localStorage.setItem('email', this.email);
      localStorage.setItem('password', this.password);
    });

    if (!localStorage.getItem('emailToValidate')) {
      this.sendCode();
    }else{
      this.loadCodeWithTimer();
    }
  }

  public validateCode(code: string): void {
    this.isLoading = true;
    this.emailValidationService
      .verifyEmailCode(this.email, this.password, code)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          this.messageService.setSuccessMessage(
            'Verificação realizada com sucesso!',
            response
          );
          setTimeout(() => this.navController.navigateRoot('/home'), 2000);
          this.removeValidationSession();
          localStorage.removeItem('password');
        },
        error: (error) => {
          this.messageService.setErrorMessage('', error);
        },
      });
  }

  public resendCode(): void {
    console.log('[resendCode] Reenviando código...');
    this.isLoading = true;
    this.emailValidationService
      .sendEmailCode(this.email)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response: EmailCodeResponse) => {
          this.messageService.setSuccessMessage(
            'Código de verificação enviado com sucesso!',
            ''
          );
          this.countdown = response.timeValidCode;
          console.log('[resendCode] Novo countdown recebido:', this.countdown);
          localStorage.setItem('lastSend', Date.now().toString());
          this.loadCodeWithTimer();
        },
        error: (error) => {
          this.messageService.setErrorMessage('', error);
        },
      });
  }

  private sendCode(): void {
    console.log('[sendCode] Enviando código pela primeira vez...');
    this.loadCodeWithTimer();
    this.initValidationSession();
    this.emailValidationService.sendEmailCode(this.email).subscribe({
      next: (response: EmailCodeResponse) => {
        this.countdown = response.timeValidCode;
        console.log('[sendCode] Countdown inicial:', this.countdown);
      },
      error: (error) => this.messageService.setErrorMessage('', error),
    });
  }

  private startCountdown(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    console.log('[startCountdown] Iniciando contagem regressiva de:', this.countdown);
    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
        console.log('[startCountdown] Countdown atual:', this.countdown);
      } else {
        console.log('[startCountdown] Countdown finalizado');
        clearInterval(this.interval);
      }
    }, 1000);
  }

  private loadCodeWithTimer(): void {
    console.log('[loadCodeWithTimer] Carregando timer...');
    let lastSend = localStorage.getItem('lastSend');
    if (!lastSend) {
      lastSend = Date.now().toString();
      localStorage.setItem('lastSend', lastSend);
    }
    const elapsedTime = Date.now() - Number(lastSend);
    const remaining = Math.max(0, this.countdown - elapsedTime);
    this.countdown = remaining < 1500 ? 0 : Math.floor(remaining / 1000);
    console.log('[loadCodeWithTimer] Tempo decorrido:', elapsedTime, 'ms');
    console.log('[loadCodeWithTimer] Countdown ajustado para:', this.countdown);
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
