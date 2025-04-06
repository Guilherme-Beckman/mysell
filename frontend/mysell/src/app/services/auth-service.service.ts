import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private apiUrl = "http://localhost:8080/";
  constructor(private httpClient: HttpClient)  {}

  login(email: string, password: string): Observable<any> {
   const headers = new HttpHeaders().set('Content-Type', 'application/json');
   const body = JSON.stringify({ email, password });
    return this.httpClient.post<any>(`${this.apiUrl}login`, body, { headers });
  }
}