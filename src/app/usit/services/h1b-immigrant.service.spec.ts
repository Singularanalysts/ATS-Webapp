import { TestBed } from '@angular/core/testing';

import { H1bImmigrantService } from './h1b-immigrant.service';

describe('H1bImmigrantService', () => {
  let service: H1bImmigrantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(H1bImmigrantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
