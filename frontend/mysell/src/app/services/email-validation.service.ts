import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
export interface EmailCodeResponse {
  sucessMessage: string;
  timeValidCode: number;
}
@Injectable({
  providedIn: 'root',
})
export class EmailValidationService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  sendEmailCode(): Observable<EmailCodeResponse> {
    return this.httpClient.get<EmailCodeResponse>(
      `${this.apiUrl}auth/sendCode`
    );
  }
  verifyEmailCode(code: string): Observable<any> {
    return this.httpClient.post(
      `${this.apiUrl}auth/verify`,
      { code: code },
      { responseType: 'text' }
    );
  }
}
