import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementSubmissionCountComponent } from './requirement-submission-count.component';

describe('RequirementSubmissionCountComponent', () => {
  let component: RequirementSubmissionCountComponent;
  let fixture: ComponentFixture<RequirementSubmissionCountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequirementSubmissionCountComponent]
    });
    fixture = TestBed.createComponent(RequirementSubmissionCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
