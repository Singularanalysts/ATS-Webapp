import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCurrentPrimaryVendorComponent } from './add-current-primary-vendor.component';

describe('AddCurrentPrimaryVendorComponent', () => {
  let component: AddCurrentPrimaryVendorComponent;
  let fixture: ComponentFixture<AddCurrentPrimaryVendorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddCurrentPrimaryVendorComponent]
    });
    fixture = TestBed.createComponent(AddCurrentPrimaryVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
