import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociatedCompaniesComponent } from './associated-companies.component';

describe('AssociatedCompaniesComponent', () => {
  let component: AssociatedCompaniesComponent;
  let fixture: ComponentFixture<AssociatedCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssociatedCompaniesComponent]
    });
    fixture = TestBed.createComponent(AssociatedCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
