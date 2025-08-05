import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTrackingComponent } from './login-tracking.component';

describe('LoginTrackingComponent', () => {
  let component: LoginTrackingComponent;
  let fixture: ComponentFixture<LoginTrackingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginTrackingComponent]
    });
    fixture = TestBed.createComponent(LoginTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
