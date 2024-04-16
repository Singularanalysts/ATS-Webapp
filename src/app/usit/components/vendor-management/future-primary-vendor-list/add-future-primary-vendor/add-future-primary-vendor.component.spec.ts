import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFuturePrimaryVendorComponent } from './add-future-primary-vendor.component';

describe('AddFuturePrimaryVendorComponent', () => {
  let component: AddFuturePrimaryVendorComponent;
  let fixture: ComponentFixture<AddFuturePrimaryVendorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddFuturePrimaryVendorComponent]
    });
    fixture = TestBed.createComponent(AddFuturePrimaryVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
