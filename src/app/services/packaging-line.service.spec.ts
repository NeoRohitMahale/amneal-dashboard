import { TestBed, inject } from '@angular/core/testing';

import { PackagingLineService } from './packaging-line.service';

describe('PackagingLineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PackagingLineService]
    });
  });

  it('should be created', inject([PackagingLineService], (service: PackagingLineService) => {
    expect(service).toBeTruthy();
  }));
});
