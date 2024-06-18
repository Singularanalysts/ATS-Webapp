import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPrimaryVendorListComponent } from './current-primary-vendor-list.component';

describe('CurrentPrimaryVendorListComponent', () => {
  let component: CurrentPrimaryVendorListComponent;
  let fixture: ComponentFixture<CurrentPrimaryVendorListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CurrentPrimaryVendorListComponent]
    });
    fixture = TestBed.createComponent(CurrentPrimaryVendorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
