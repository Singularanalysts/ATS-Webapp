import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResumeVendorComponent } from './add-resume-vendor.component';

describe('AddResumeVendorComponent', () => {
  let component: AddResumeVendorComponent;
  let fixture: ComponentFixture<AddResumeVendorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddResumeVendorComponent]
    });
    fixture = TestBed.createComponent(AddResumeVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
