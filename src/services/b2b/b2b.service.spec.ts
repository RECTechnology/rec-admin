import { TestBed } from '@angular/core/testing';

import { B2bService } from './b2b.service';

describe('B2bService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: B2bService = TestBed.get(B2bService);
    expect(service).toBeTruthy();
  });
});
