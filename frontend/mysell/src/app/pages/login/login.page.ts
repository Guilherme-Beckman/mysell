import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthFormComponent } from 'src/app/components/auth-form/auth-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, AuthFormComponent]
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  handleForm(event: any) {
    console.log(event);

  }

}
