import { TestBed } from '@angular/core/testing';

import { EditProductSelectionServiceService } from './edit-product-selection-service.service';

describe('EditProductSelectionServiceService', () => {
  let service: EditProductSelectionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditProductSelectionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
