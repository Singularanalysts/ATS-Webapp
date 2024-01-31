import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubmissionComponent } from './add-submission.component';

describe('AddSubmissionComponent', () => {
  let component: AddSubmissionComponent;
  let fixture: ComponentFixture<AddSubmissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddSubmissionComponent]
    });
    fixture = TestBed.createComponent(AddSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
