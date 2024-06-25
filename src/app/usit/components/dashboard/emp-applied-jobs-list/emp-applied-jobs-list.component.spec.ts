import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAppliedJobsListComponent } from './emp-applied-jobs-list.component';

describe('EmpAppliedJobsListComponent', () => {
  let component: EmpAppliedJobsListComponent;
  let fixture: ComponentFixture<EmpAppliedJobsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmpAppliedJobsListComponent]
    });
    fixture = TestBed.createComponent(EmpAppliedJobsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
