import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionDeleteComponent } from './submission-delete.component';

describe('SubmissionDeleteComponent', () => {
  let component: SubmissionDeleteComponent;
  let fixture: ComponentFixture<SubmissionDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmissionDeleteComponent]
    });
    fixture = TestBed.createComponent(SubmissionDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
