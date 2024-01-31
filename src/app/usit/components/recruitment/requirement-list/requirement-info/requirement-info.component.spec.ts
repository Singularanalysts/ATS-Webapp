import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementInfoComponent } from './requirement-info.component';

describe('RequirementInfoComponent', () => {
  let component: RequirementInfoComponent;
  let fixture: ComponentFixture<RequirementInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequirementInfoComponent]
    });
    fixture = TestBed.createComponent(RequirementInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
