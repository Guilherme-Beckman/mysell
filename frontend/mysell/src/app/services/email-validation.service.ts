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

  sendEmailCode(): Observable<string> {
    return this.httpClient.get(`${this.apiUrl}auth/sendCode`, {
      responseType: 'text',
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
