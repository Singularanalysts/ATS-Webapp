import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistedCompaniesListComponent } from './blacklisted-companies-list.component';

describe('BlacklistedCompaniesListComponent', () => {
  let component: BlacklistedCompaniesListComponent;
  let fixture: ComponentFixture<BlacklistedCompaniesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BlacklistedCompaniesListComponent]
    });
    fixture = TestBed.createComponent(BlacklistedCompaniesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
