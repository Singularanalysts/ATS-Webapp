import { TestBed } from '@angular/core/testing';

import { AllFilesService } from './all-files.service';

describe('AllFilesService', () => {
  let service: AllFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
