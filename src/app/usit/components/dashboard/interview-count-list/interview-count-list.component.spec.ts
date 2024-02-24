import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewCountListComponent } from './interview-count-list.component';

describe('InterviewCountListComponent', () => {
  let component: InterviewCountListComponent;
  let fixture: ComponentFixture<InterviewCountListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InterviewCountListComponent]
    });
    fixture = TestBed.createComponent(InterviewCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
