import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpInterviewsListComponent } from './emp-interviews-list.component';

describe('EmpInterviewsListComponent', () => {
  let component: EmpInterviewsListComponent;
  let fixture: ComponentFixture<EmpInterviewsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmpInterviewsListComponent]
    });
    fixture = TestBed.createComponent(EmpInterviewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
