import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly expirationTimeValue = 60 * 60 * 1000; // 1 hora

  constructor(private httpClient: HttpClient) {}

  // ===== HTTP Methods =====

  public login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}auth/login`,
      { email, password },
      {
        headers: this.getJsonHeaders(),
        withCredentials: true,
      }
    );
  }

  public logout(): void {
    this.clearToken();
  }

  public register(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}auth/register`,
      { email, password },
      {
        headers: this.getJsonHeaders(),
        withCredentials: true,
      }
    );
  }

  public verifyIfUserAlreadyExists(email: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}auth/userExists/${email}`, {
      responseType: 'text',
    });
  }

  public async onGoogleOAuth2(): Promise<void> {
    Browser.addListener('browserFinished', async () => {
      // Navegador fechado
    });
    await Browser.open({ url: `${this.apiUrl}oauth2/authorization/google` });
  }

  public async onFacebookOAuth2(): Promise<void> {
    Browser.addListener('browserFinished', async () => {
      // Navegador fechado
    });
    await Browser.open({ url: `${this.apiUrl}oauth2/authorization/facebook` });
  }

  // ===== Token Control =====

  public saveToken(token: string): void {
    if (!this.isLocalStorageAvailable()) return;
    localStorage.setItem('token', token);
    this.setExpirationTime();
  }

  public isTokenExpired(): boolean {
    const token = this.getToken();
    const expiration = this.getTokenExpirationTime();
    if (!token || !expiration || Date.now() > expiration) {
      this.clearToken();
      return true;
    }
    return false;
  }

  public isLoggedIn(): boolean {
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

  // ===== Helpers =====

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
