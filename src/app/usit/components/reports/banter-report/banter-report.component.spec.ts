import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanterReportComponent } from './banter-report.component';

describe('BanterReportComponent', () => {
  let component: BanterReportComponent;
  let fixture: ComponentFixture<BanterReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BanterReportComponent]
    });
    fixture = TestBed.createComponent(BanterReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
