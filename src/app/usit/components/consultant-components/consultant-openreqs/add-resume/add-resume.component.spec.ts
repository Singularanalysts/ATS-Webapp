import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResumeComponent } from './add-resume.component';

describe('AddResumeComponent', () => {
  let component: AddResumeComponent;
  let fixture: ComponentFixture<AddResumeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddResumeComponent]
    });
    fixture = TestBed.createComponent(AddResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
