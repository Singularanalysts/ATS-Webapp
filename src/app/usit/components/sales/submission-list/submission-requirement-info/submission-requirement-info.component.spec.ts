import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionRequirementInfoComponent } from './submission-requirement-info.component';

describe('SubmissionRequirementInfoComponent', () => {
  let component: SubmissionRequirementInfoComponent;
  let fixture: ComponentFixture<SubmissionRequirementInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SubmissionRequirementInfoComponent]
    });
    fixture = TestBed.createComponent(SubmissionRequirementInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
