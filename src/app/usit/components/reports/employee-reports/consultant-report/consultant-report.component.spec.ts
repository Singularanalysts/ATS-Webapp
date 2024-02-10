import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantReportComponent } from './consultant-report.component';

describe('ConsultantReportComponent', () => {
  let component: ConsultantReportComponent;
  let fixture: ComponentFixture<ConsultantReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsultantReportComponent]
    });
    fixture = TestBed.createComponent(ConsultantReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
