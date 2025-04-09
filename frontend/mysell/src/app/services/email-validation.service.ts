import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class EmailValidationService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  sendEmailCode(token: string): void {
    this.httpClient.get<any>(`${this.apiUrl}auth/sendCode`);
  }
}
