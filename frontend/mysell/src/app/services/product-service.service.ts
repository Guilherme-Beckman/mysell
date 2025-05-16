import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ProductServiceService {
  private readonly apiUrl = environment.apiUrl;

  constructor() {}
}
