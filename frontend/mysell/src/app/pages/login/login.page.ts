import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthFormComponent } from 'src/app/components/auth-form/auth-form.component';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MessagePerRequestComponent } from 'src/app/components/message-per-request/message-per-request.component';
import { LoadingSppinerComponent } from 'src/app/components/loading-sppiner/loading-sppiner.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, AuthFormComponent, MessagePerRequestComponent, LoadingSppinerComponent]
})
export class LoginPage implements OnInit {
  successMessage$;
  errorMessage$;
  isLoading = false;

  constructor(private messageService: MessageService, private authService: AuthService, private router: Router) {
    this.successMessage$ = this.messageService.successMessage$;
    this.errorMessage$ = this.messageService.errorMessage$; 
  }

  ngOnInit() {
  }
  onLogin(event: {email: string, password: string}): void {
    this.isLoading = true;

    this.authService.login(event.email, event.password).subscribe({
      next:(next)=>{
        this.isLoading = false;
        this.authService.saveToken(next.token);
        this.messageService.setSuccessMessage('Login realizado com sucesso!', next);
        setTimeout(() => {  
          this.router.navigate(['/home']);
        }
        , 2000);
      },
      error:(error)=>{
        this.isLoading = false;
        this.messageService.setErrorMessage('Erro ao realizar login!', error);
      },
      complete: () => { 
        this.isLoading = false;
      }
    })

}
}
