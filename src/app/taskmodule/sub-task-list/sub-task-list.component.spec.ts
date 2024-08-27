import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTaskListComponent } from './sub-task-list.component';

describe('SubTaskListComponent', () => {
  let component: SubTaskListComponent;
  let fixture: ComponentFixture<SubTaskListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SubTaskListComponent]
    });
    fixture = TestBed.createComponent(SubTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
