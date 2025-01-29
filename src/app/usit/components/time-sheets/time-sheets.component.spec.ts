import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSheetsComponent } from './time-sheets.component';

describe('TimeSheetsComponent', () => {
  let component: TimeSheetsComponent;
  let fixture: ComponentFixture<TimeSheetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimeSheetsComponent]
    });
    fixture = TestBed.createComponent(TimeSheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
