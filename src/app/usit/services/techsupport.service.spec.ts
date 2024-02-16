import { TestBed } from '@angular/core/testing';

import { TechsupportService } from './techsupport.service';

describe('TechsupportService', () => {
  let service: TechsupportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechsupportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
