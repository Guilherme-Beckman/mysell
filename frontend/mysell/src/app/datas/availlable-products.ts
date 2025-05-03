import { ProductSelect } from '../components/available-products/available-products.component';

export const AVAIABLE_PRODUCTS: ProductSelect[] = [
  {
    product: {
      name: 'Arroz',
      category: 'grãos',
      purchasePrice: 5.5,
      sellingPrice: 7.0,
      brand: 'Tio João',
      measure: 'kg',
    },
    selected: false,
  },
  {
    product: {
      name: 'Feijão',
      category: 'grãos',
      purchasePrice: 6.0,
      sellingPrice: 8.5,
      brand: 'Camil',
      measure: 'kg',
    },
    selected: false,
  },
  {
    product: {
      name: 'Maca',
      category: 'massas',
      purchasePrice: 3.2,
      sellingPrice: 4,
      brand: 'Renata',
      measure: 'pacote',
    },
    selected: false,
  },
  {
    product: {
      name: 'Açúcar',
      category: 'doces',
      purchasePrice: 4.0,
      sellingPrice: 5.5,
      brand: 'União',
      measure: 'kg',
    },
    selected: false,
  },
  {
    product: {
      name: 'Café',
      category: 'bebidas',
      purchasePrice: 8.0,
      sellingPrice: 10.0,
      brand: 'Pilão',
      measure: 'pacote',
    },
    selected: false,
  },
  {
    product: {
      name: 'Óleo',
      category: 'cozinha',
      purchasePrice: 4.5,
      sellingPrice: 6.0,
      brand: 'Liza',
      measure: 'litro',
    },
    selected: false,
  },
];
