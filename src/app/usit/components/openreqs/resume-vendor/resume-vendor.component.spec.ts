import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeVendorComponent } from './resume-vendor.component';

describe('ResumeVendorComponent', () => {
  let component: ResumeVendorComponent;
  let fixture: ComponentFixture<ResumeVendorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumeVendorComponent]
    });
    fixture = TestBed.createComponent(ResumeVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
