import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Product } from '../interfaces/product';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CATEGORIES } from '../datas/categories';
import { getMeasureIdByName } from '../datas/measures';

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
  public createProduct(product: Product): Observable<any> {
    console.log('[ProductService] Produto recebido para criação:', product);

    const dto = this.convertToCreateProductDTO(product);
    console.log('[ProductService] DTO convertido para criação:', dto);

    return this.httpClient.post(`${this.apiUrl}product`, dto);
  }

  public convertToCreateProductDTO(product: Product): any {
    const category = CATEGORIES.find((c) => c.name === product.category);
    const unitOfMeasureId = getMeasureIdByName(
      product.measure.unitOfMeasure.toUpperCase()
    );

    const dto = {
      name: product.name,
      categoryId: category?.id ?? 1,
      purchasedPrice: product.purchasePrice,
      priceToSell: product.sellingPrice,
      brand: product.brand,
      productUnitOfMeasureDTO: {
        quantity: product.measure.quantity,
        unitOfMeasureId: unitOfMeasureId ?? 1,
      },
    };

    console.log('[ProductService] convertToCreateProductDTO result:', dto);
    return dto;
  }
  public getMyProducts(): Observable<Product[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}product/my`).pipe(
      map((response) =>
        response.map((item) => ({
          id: item.productsId ?? '',
          name: item.name,
          category: item.category?.name ?? '',
          purchasePrice: item.purchasedPrice ?? 0,
          sellingPrice: item.priceToSell ?? 0,
          brand: item.brand,
          measure: {
            quantity: item.productUnitOfMeasureDTO?.quantity ?? 0,
            unitOfMeasure:
              item.productUnitOfMeasureDTO?.unityOfMeasure?.name ?? '',
          },
        }))
      )
    );
  }
  public deleteProductById(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}product/${id}`);
  }
  public updateProduct(product: Product): Observable<any> {
    if (!product.id) {
      throw new Error('Produto sem ID não pode ser atualizado.');
    }

    console.log('[ProductService] Produto recebido para atualização:', product);

    const dto = this.convertToCreateProductDTO(product);
    console.log('[ProductService] DTO convertido para atualização:', dto);

    return this.httpClient.put(`${this.apiUrl}product/${product.id}`, dto);
  }
}
