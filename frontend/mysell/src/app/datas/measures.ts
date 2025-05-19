import { Measure } from '../interfaces/measure';

export const MEASURES: string[] = [
  'NONE',
  'ML',
  'L',
  'MG',
  'G',
  'KG',
  'LB',
  'OZ',
  'UN',
  'MM',
  'CM',
  'M',
  'KM',
];

// Lista com id (usa Measure)
export const MEASURES_WITH_ID = [
  { id: 1, name: 'NONE' },
  { id: 2, name: 'ML' },
  { id: 3, name: 'L' },
  { id: 4, name: 'MG' },
  { id: 5, name: 'G' },
  { id: 6, name: 'KG' },
  { id: 7, name: 'LB' },
  { id: 8, name: 'OZ' },
  { id: 9, name: 'UN' },
  { id: 10, name: 'MM' },
  { id: 11, name: 'CM' },
  { id: 12, name: 'M' },
  { id: 13, name: 'KM' },
];

// Map<string, number> para busca rápida
export const MEASURE_NAME_TO_ID: Map<string, number> = new Map(
  MEASURES_WITH_ID.map(({ name, id }) => [name, id])
);

// Função utilitária
export function getMeasureIdByName(name: string): number | undefined {
  return MEASURE_NAME_TO_ID.get(name);
}
