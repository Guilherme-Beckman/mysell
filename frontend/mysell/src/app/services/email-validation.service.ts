import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class EmailValidationService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  sendEmailCode(): void {
    this.httpClient
      .get(`${this.apiUrl}auth/sendCode`, {
        responseType: 'text',
      })
      .subscribe({
        next: (response) => {
          console.log('Email code sent successfully:', response);
        },
        error: (error) => {
          console.error('Error sending email code:', error);
        },
        complete: () => {
          console.log('Email code sending process completed.');
        },
      });
  }
  verifyEmailCode(code: string): Observable<any> {
    return this.httpClient.post(
      `${this.apiUrl}auth/verify`,
      { code: code },
      { responseType: 'text' }
    );
  }
}
