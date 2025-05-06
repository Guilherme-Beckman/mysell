import { ProductSelect } from '../components/available-products/available-products.component';

export const AVAIABLE_PRODUCTS: ProductSelect[] = [
  {
    product: {
      name: 'Arroz',
      category: 'Alimentos/Bebidas',
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
      category: 'Alimentos/Bebidas',
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
      category: 'Alimentos/Bebidas',
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
      category: 'Alimentos/Bebidas',
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
      category: 'Alimentos/Bebidas',
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
      category: 'Utensílios de cozinha e utensílios de mesa',
      purchasePrice: 4.5,
      sellingPrice: 6.0,
      brand: 'Liza',
      measure: 'litro',
    },
    selected: false,
  },
];
