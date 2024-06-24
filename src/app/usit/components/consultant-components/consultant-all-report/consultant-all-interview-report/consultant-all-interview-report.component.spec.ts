import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantAllInterviewReportComponent } from './consultant-all-interview-report.component';

describe('ConsultantAllInterviewReportComponent', () => {
  let component: ConsultantAllInterviewReportComponent;
  let fixture: ComponentFixture<ConsultantAllInterviewReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsultantAllInterviewReportComponent]
    });
    fixture = TestBed.createComponent(ConsultantAllInterviewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
