import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcingConsultantReportComponent } from './sourcing-consultant-report.component';

describe('SourcingConsultantReportComponent', () => {
  let component: SourcingConsultantReportComponent;
  let fixture: ComponentFixture<SourcingConsultantReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SourcingConsultantReportComponent]
    });
    fixture = TestBed.createComponent(SourcingConsultantReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
