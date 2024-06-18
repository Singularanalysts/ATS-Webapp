import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuturePrimaryVendorListComponent } from './future-primary-vendor-list.component';

describe('FuturePrimaryVendorListComponent', () => {
  let component: FuturePrimaryVendorListComponent;
  let fixture: ComponentFixture<FuturePrimaryVendorListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FuturePrimaryVendorListComponent]
    });
    fixture = TestBed.createComponent(FuturePrimaryVendorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
