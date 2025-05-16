import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Product } from '../interfaces/product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public getProductByBarcode(barcode: string): Observable<Product> {
    return this.httpClient.get<Product>(
      `${this.apiUrl}product/code/${barcode}`
    );
  }
}
