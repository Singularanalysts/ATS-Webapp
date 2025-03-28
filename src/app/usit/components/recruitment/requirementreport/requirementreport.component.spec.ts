import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementreportComponent } from './requirementreport.component';

describe('RequirementreportComponent', () => {
  let component: RequirementreportComponent;
  let fixture: ComponentFixture<RequirementreportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequirementreportComponent]
    });
    fixture = TestBed.createComponent(RequirementreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
