import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedCountComponent } from './assigned-count.component';

describe('AssignedCountComponent', () => {
  let component: AssignedCountComponent;
  let fixture: ComponentFixture<AssignedCountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignedCountComponent]
    });
    fixture = TestBed.createComponent(AssignedCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
