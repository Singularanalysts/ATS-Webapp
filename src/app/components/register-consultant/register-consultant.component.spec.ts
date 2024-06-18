import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterConsultantComponent } from './register-consultant.component';

describe('RegisterConsultantComponent', () => {
  let component: RegisterConsultantComponent;
  let fixture: ComponentFixture<RegisterConsultantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterConsultantComponent]
    });
    fixture = TestBed.createComponent(RegisterConsultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
