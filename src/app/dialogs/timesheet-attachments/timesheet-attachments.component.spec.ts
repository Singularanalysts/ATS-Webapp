import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetAttachmentsComponent } from './timesheet-attachments.component';

describe('TimesheetAttachmentsComponent', () => {
  let component: TimesheetAttachmentsComponent;
  let fixture: ComponentFixture<TimesheetAttachmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimesheetAttachmentsComponent]
    });
    fixture = TestBed.createComponent(TimesheetAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
