import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequirementComponent } from './add-requirement.component';

describe('AddRequirementComponent', () => {
  let component: AddRequirementComponent;
  let fixture: ComponentFixture<AddRequirementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddRequirementComponent]
    });
    fixture = TestBed.createComponent(AddRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
