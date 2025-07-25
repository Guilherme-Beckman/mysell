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
  public sellProduct(productId: string, quantity: number): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}sell`,
      { productId, quantity },
      { withCredentials: true }
    );
  }
  public deleteSell(sellId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}sell/${sellId}`, {
      withCredentials: true,
    });
  }
}
