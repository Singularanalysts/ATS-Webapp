import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantAllSubmissionReportComponent } from './consultant-all-submission-report.component';

describe('ConsultantAllSubmissionReportComponent', () => {
  let component: ConsultantAllSubmissionReportComponent;
  let fixture: ComponentFixture<ConsultantAllSubmissionReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsultantAllSubmissionReportComponent]
    });
    fixture = TestBed.createComponent(ConsultantAllSubmissionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
