import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantAllReportComponent } from './consultant-all-report.component';

describe('ConsultantAllReportComponent', () => {
  let component: ConsultantAllReportComponent;
  let fixture: ComponentFixture<ConsultantAllReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsultantAllReportComponent]
    });
    fixture = TestBed.createComponent(ConsultantAllReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
