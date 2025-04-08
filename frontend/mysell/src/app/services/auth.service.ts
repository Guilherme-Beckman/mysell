import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://192.168.100.105:8080/auth/';
  private readonly expirationTimeValue = 60 * 60 * 1000; // 1 hora

  constructor(private httpClient: HttpClient) {}

  // ============
  // HTTP Methods
  // ============

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}login`,
      { email, password },
      {
        headers: this.getJsonHeaders(),
        withCredentials: true,
      }
    );
  }

  register(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}register`,
      { email, password },
      {
        headers: this.getJsonHeaders(),
        withCredentials: true,
      }
    );
  }

  // ============
  // Token Control
  // ============

  saveToken(token: string): void {
    if (!this.isLocalStorageAvailable()) return;

    localStorage.setItem('token', token);

    this.setExpirationTime();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    const expiration = this.getTokenExpirationTime();

    if (!token || !expiration || Date.now() > expiration) {
      this.clearToken();
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const expiration = this.getTokenExpirationTime();
    return !!token && !!expiration && Date.now() < expiration;
  }

  private getToken(): string {
    return this.isLocalStorageAvailable()
      ? localStorage.getItem('token') || ''
      : '';
  }

  private getTokenExpirationTime(): number {
    const expiration = localStorage.getItem('expiration');
    return parseInt(expiration || '0', 10);
  }

  private clearToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  // ============
  // Helpers
  // ============

  private getJsonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
  }
  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }
  private setExpirationTime(): void {
    const expiration = Date.now() + this.expirationTimeValue;
    localStorage.setItem('expiration', expiration.toString());
  }
}
