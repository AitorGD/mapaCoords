import { TestBed } from '@angular/core/testing';

import { AemetService } from './aemet.service';

describe('AemetService', () => {
  let service: AemetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AemetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
