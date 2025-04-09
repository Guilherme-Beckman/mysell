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

@Component({
  selector: 'app-email-validation',
  templateUrl: './email-validation.page.html',
  styleUrls: ['./email-validation.page.scss'],
  standalone: true,
  imports: [CommonModule, CodeSquaresComponent],
})
export class EmailValidationPage implements OnInit {
  sendCodeLink = '/auth/send-code';
  constructor(private emailValidationService: EmailValidationService) {}

  ngOnInit() {}

  getCode(event: string) {
    console.log('Code received:', event);
  }
}
