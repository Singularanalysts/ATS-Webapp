import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionCountListComponent } from './submission-count-list.component';

describe('SubmissionCountListComponent', () => {
  let component: SubmissionCountListComponent;
  let fixture: ComponentFixture<SubmissionCountListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SubmissionCountListComponent]
    });
    fixture = TestBed.createComponent(SubmissionCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
