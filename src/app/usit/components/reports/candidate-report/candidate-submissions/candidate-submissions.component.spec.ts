import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSubmissionsComponent } from './candidate-submissions.component';

describe('CandidateSubmissionsComponent', () => {
  let component: CandidateSubmissionsComponent;
  let fixture: ComponentFixture<CandidateSubmissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CandidateSubmissionsComponent]
    });
    fixture = TestBed.createComponent(CandidateSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
