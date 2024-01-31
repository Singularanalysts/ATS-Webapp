import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCompanyRecInfoComponent } from './vendor-company-rec-info.component';

describe('VendorCompanyRecInfoComponent', () => {
  let component: VendorCompanyRecInfoComponent;
  let fixture: ComponentFixture<VendorCompanyRecInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VendorCompanyRecInfoComponent]
    });
    fixture = TestBed.createComponent(VendorCompanyRecInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
