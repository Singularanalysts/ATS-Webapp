import { TestBed } from '@angular/core/testing';

import { TechnologyTagService } from './technology-tag.service';

describe('TechnologyTagService', () => {
  let service: TechnologyTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechnologyTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
