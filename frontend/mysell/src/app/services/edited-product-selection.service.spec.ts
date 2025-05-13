import { TestBed } from '@angular/core/testing';

import { EditedProductSelectionService } from './edited-product-selection.service';

describe('EditedProductSelectionService', () => {
  let service: EditedProductSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditedProductSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
