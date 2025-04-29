import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class SellService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public getMySell(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}sell/my`, {
      withCredentials: true,
    });
  }
}
