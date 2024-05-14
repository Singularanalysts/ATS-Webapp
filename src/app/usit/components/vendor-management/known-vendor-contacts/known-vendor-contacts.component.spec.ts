import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnownVendorContactsComponent } from './known-vendor-contacts.component';

describe('KnownVendorContactsComponent', () => {
  let component: KnownVendorContactsComponent;
  let fixture: ComponentFixture<KnownVendorContactsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KnownVendorContactsComponent]
    });
    fixture = TestBed.createComponent(KnownVendorContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
