import { TestBed } from '@angular/core/testing';

import { EnvServiceService } from './env-service.service';

describe('EnvServiceService', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  }); beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnvServiceService = TestBed.get(EnvServiceService);
    expect(service).toBeTruthy();
  });
});
