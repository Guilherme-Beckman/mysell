import { TestBed } from '@angular/core/testing';

import { SellService } from './sell.service';

describe('SellService', () => {
  let service: SellService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
