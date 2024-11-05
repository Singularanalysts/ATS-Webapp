import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementReportComponent } from './requirement-report.component';

describe('RequirementReportComponent', () => {
  let component: RequirementReportComponent;
  let fixture: ComponentFixture<RequirementReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequirementReportComponent]
    });
    fixture = TestBed.createComponent(RequirementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
