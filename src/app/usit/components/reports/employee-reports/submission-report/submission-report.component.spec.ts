import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionReportComponent } from './submission-report.component';

describe('SubmissionReportComponent', () => {
  let component: SubmissionReportComponent;
  let fixture: ComponentFixture<SubmissionReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SubmissionReportComponent]
    });
    fixture = TestBed.createComponent(SubmissionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
