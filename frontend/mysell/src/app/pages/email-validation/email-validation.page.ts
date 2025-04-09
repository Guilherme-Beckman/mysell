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
  sendCodeLink = `${this.apiUrl}auth/sendCode`;
  errorMessage$;
  successMessage$;
  isLoading = false;
  constructor(
    private emailValidationService: EmailValidationService,
    private messageService: MessageService
  ) {
    this.errorMessage$ = this.messageService.errorMessage$;
    this.successMessage$ = this.messageService.successMessage$;
  }

  ngOnInit() {}

  getCode(event: string) {
    this.isLoading = true;
    this.emailValidationService.verifyEmailCode(event).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.messageService.setSuccessMessage(
          'Código de verificação enviado com sucesso!',
          response
        );
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

        console.log('Code verification process completed.');
      },
    });
  }
}
