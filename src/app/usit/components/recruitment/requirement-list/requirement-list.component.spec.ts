import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementListComponent } from './requirement-list.component';

describe('RequirementListComponent', () => {
  let component: RequirementListComponent;
  let fixture: ComponentFixture<RequirementListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RequirementListComponent]
    });
    fixture = TestBed.createComponent(RequirementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
