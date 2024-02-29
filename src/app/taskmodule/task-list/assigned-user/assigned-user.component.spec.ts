import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedUserComponent } from './assigned-user.component';

describe('AssignedUserComponent', () => {
  let component: AssignedUserComponent;
  let fixture: ComponentFixture<AssignedUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssignedUserComponent]
    });
    fixture = TestBed.createComponent(AssignedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
