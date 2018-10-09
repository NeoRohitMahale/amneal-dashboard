import { TestBed, inject } from '@angular/core/testing';

import { PackagingService } from './packaging.service';

describe('PackagingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PackagingService]
    });
  });

  it('should be created', inject([PackagingService], (service: PackagingService) => {
    expect(service).toBeTruthy();
  }));
});
