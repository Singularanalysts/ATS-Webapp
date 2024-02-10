import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcingReportsComponent } from './sourcing-reports.component';

describe('SourcingReportsComponent', () => {
  let component: SourcingReportsComponent;
  let fixture: ComponentFixture<SourcingReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SourcingReportsComponent]
    });
    fixture = TestBed.createComponent(SourcingReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
