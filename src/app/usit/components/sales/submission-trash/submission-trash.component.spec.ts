import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionTrashComponent } from './submission-trash.component';

describe('SubmissionTrashComponent', () => {
  let component: SubmissionTrashComponent;
  let fixture: ComponentFixture<SubmissionTrashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmissionTrashComponent]
    });
    fixture = TestBed.createComponent(SubmissionTrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
