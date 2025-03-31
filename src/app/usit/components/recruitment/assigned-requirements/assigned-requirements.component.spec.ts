import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedRequirementsComponent } from './assigned-requirements.component';

describe('AssignedRequirementsComponent', () => {
  let component: AssignedRequirementsComponent;
  let fixture: ComponentFixture<AssignedRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignedRequirementsComponent]
    });
    fixture = TestBed.createComponent(AssignedRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
