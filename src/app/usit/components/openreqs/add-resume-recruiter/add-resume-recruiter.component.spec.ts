import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResumeRecruiterComponent } from './add-resume-recruiter.component';

describe('AddResumeRecruiterComponent', () => {
  let component: AddResumeRecruiterComponent;
  let fixture: ComponentFixture<AddResumeRecruiterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddResumeRecruiterComponent]
    });
    fixture = TestBed.createComponent(AddResumeRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
