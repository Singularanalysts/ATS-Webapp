import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEmailComponent } from './report-email.component';

describe('ReportEmailComponent', () => {
  let component: ReportEmailComponent;
  let fixture: ComponentFixture<ReportEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportEmailComponent]
    });
    fixture = TestBed.createComponent(ReportEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
