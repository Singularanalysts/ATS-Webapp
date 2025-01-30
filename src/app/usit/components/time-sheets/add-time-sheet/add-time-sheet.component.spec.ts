import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimeSheetComponent } from './add-time-sheet.component';

describe('AddTimeSheetComponent', () => {
  let component: AddTimeSheetComponent;
  let fixture: ComponentFixture<AddTimeSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddTimeSheetComponent]
    });
    fixture = TestBed.createComponent(AddTimeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
