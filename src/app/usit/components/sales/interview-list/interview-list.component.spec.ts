import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewListComponent } from './interview-list.component';

describe('InterviewListComponent', () => {
  let component: InterviewListComponent;
  let fixture: ComponentFixture<InterviewListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InterviewListComponent]
    });
    fixture = TestBed.createComponent(InterviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
