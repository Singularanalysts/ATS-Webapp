import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFulltimeResumeComponent } from './add-fulltime-resume.component';

describe('AddFulltimeResumeComponent', () => {
  let component: AddFulltimeResumeComponent;
  let fixture: ComponentFixture<AddFulltimeResumeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFulltimeResumeComponent]
    });
    fixture = TestBed.createComponent(AddFulltimeResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
