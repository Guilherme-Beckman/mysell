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
import { ActivatedRoute } from '@angular/router';

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
  public email: string = '';
  public countdown: number = 60;
  private readonly timeToUserResendCode: number = 5000; // 1 minuto
  private interval: any;
  public errorMessage$;
  public successMessage$;
  public isLoading: boolean = false;

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
    }

    this.loadCodeWithTimer();
  }

  public getCode(event: string): void {
    this.isLoading = true;
    if (!this.userCanResendCode()) {
      return;
    }

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

  public startCountdown(): void {
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

  public resendCode(): void {
    this.isLoading = true;
    this.emailValidationService.sendEmailCode().subscribe({
      next: (duration) => {
        this.countdown = parseInt(duration, 10);
        this.startCountdown();
        localStorage.setItem('lastSend', Date.now().toString());
        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.setErrorMessage(
          'Erro ao reenviar o código de verificação.',
          error
        );
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
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

  private sendCode(): void {
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
  private userCanResendCode(): boolean {
    const now = Date.now();
    const lastSend = Number(localStorage.getItem('lastSend'));
    if (lastSend && now - lastSend < this.timeToUserResendCode) {
      return false;
    }
    return true;
  }
}
