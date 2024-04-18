import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmWithRadioButtonComponent } from './confirm-with-radio-button.component';

describe('ConfirmWithRadioButtonComponent', () => {
  let component: ConfirmWithRadioButtonComponent;
  let fixture: ComponentFixture<ConfirmWithRadioButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmWithRadioButtonComponent]
    });
    fixture = TestBed.createComponent(ConfirmWithRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
