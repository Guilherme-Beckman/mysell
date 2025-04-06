import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  private apiUrl = "http://192.168.100.105:8080/auth/";
  constructor(private httpClient: HttpClient)  {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    
    const body = JSON.stringify({ email, password });
    
    return this.httpClient.post<any>(`${this.apiUrl}login`, body, { 
      headers,
      withCredentials: true
    });
  }
  register(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    const body = JSON.stringify({ email, password });
    return this.httpClient.post<any>(`${this.apiUrl}register`, body, {
      headers,
      withCredentials: true
    });
  }
  saveToken(token: string):void{
    if(this.isLocalStorageAvailable()){
      localStorage.setItem('token', token);
  }
}
private isLocalStorageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}
}