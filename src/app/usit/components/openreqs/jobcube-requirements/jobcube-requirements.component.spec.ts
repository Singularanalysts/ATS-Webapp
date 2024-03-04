import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcubeRequirementsComponent } from './jobcube-requirements.component';

describe('JobcubeRequirementsComponent', () => {
  let component: JobcubeRequirementsComponent;
  let fixture: ComponentFixture<JobcubeRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobcubeRequirementsComponent]
    });
    fixture = TestBed.createComponent(JobcubeRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
