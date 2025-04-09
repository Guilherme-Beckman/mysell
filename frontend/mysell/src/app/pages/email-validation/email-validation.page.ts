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

@Component({
  selector: 'app-email-validation',
  templateUrl: './email-validation.page.html',
  styleUrls: ['./email-validation.page.scss'],
  standalone: true,
  imports: [CommonModule, CodeSquaresComponent],
})
export class EmailValidationPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
