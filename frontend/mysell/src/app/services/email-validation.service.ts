import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

export interface EmailCodeResponse {
  sucessMessage: string;
  timeValidCode: number;
}

export interface UserDTO {
  email: string;
  password: string;
}

export interface UserAndCode {
  userDTO: UserDTO;
  code: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailValidationService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  sendEmailCode(email: string): Observable<EmailCodeResponse> {
    return this.httpClient.get<EmailCodeResponse>(
      `${this.apiUrl}auth/sendCode/${email}`
    );
  }

  verifyEmailCode(
    email: string,
    password: string,
    code: string
  ): Observable<any> {
    const payload: UserAndCode = {
      userDTO: { email, password },
      code,
    };

    return this.httpClient.post(`${this.apiUrl}auth/verify`, payload);
  }
}
