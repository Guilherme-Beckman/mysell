import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Product } from '../interfaces/product';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public getProductByBarcode(barcode: string): Observable<Product> {
    return this.httpClient
      .get<any>(`${this.apiUrl}product/code/${barcode}`)
      .pipe(
        map((response) => ({
          id: response.id ?? '',
          name: response.name,
          category: response.category?.name ?? '',
          purchasePrice: response.purchasedPrice ?? 0,
          sellingPrice: response.priceToSell ?? 0,
          brand: response.brand,
          measure: {
            quantity: response.productUnitOfMeasureDTO?.quantity ?? 0,
            unitOfMeasure:
              response.productUnitOfMeasureDTO?.unityOfMeasure?.name ?? '',
          },
        }))
      );
  }
}
