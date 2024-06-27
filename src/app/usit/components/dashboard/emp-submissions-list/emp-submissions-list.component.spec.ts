import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpSubmissionsListComponent } from './emp-submissions-list.component';

describe('EmpSubmissionsListComponent', () => {
  let component: EmpSubmissionsListComponent;
  let fixture: ComponentFixture<EmpSubmissionsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmpSubmissionsListComponent]
    });
    fixture = TestBed.createComponent(EmpSubmissionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
