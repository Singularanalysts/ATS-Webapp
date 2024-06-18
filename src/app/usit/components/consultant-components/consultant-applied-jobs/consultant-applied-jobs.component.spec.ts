import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantAppliedJobsComponent } from './consultant-applied-jobs.component';

describe('ConsultantAppliedJobsComponent', () => {
  let component: ConsultantAppliedJobsComponent;
  let fixture: ComponentFixture<ConsultantAppliedJobsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsultantAppliedJobsComponent]
    });
    fixture = TestBed.createComponent(ConsultantAppliedJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
