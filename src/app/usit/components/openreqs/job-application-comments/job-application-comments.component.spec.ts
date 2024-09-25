import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicationCommentsComponent } from './job-application-comments.component';

describe('JobApplicationCommentsComponent', () => {
  let component: JobApplicationCommentsComponent;
  let fixture: ComponentFixture<JobApplicationCommentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobApplicationCommentsComponent]
    });
    fixture = TestBed.createComponent(JobApplicationCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
