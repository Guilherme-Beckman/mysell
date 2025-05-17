import { Measure } from './measure';

export interface Product {
  id: string;
  name: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  brand: string;
  measure: Measure;
}
