import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKnownVendorContactsComponent } from './add-known-vendor-contacts.component';

describe('AddKnownVendorContactsComponent', () => {
  let component: AddKnownVendorContactsComponent;
  let fixture: ComponentFixture<AddKnownVendorContactsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddKnownVendorContactsComponent]
    });
    fixture = TestBed.createComponent(AddKnownVendorContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
