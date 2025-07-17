import { TestBed } from '@angular/core/testing';

import { ProductSelectionService } from './product-selection.service';

describe('ProductSelectionService', () => {
  let service: ProductSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
