import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExecutiveRatingComponent } from './add-executive-rating.component';

describe('AddExecutiveRatingComponent', () => {
  let component: AddExecutiveRatingComponent;
  let fixture: ComponentFixture<AddExecutiveRatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddExecutiveRatingComponent]
    });
    fixture = TestBed.createComponent(AddExecutiveRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
