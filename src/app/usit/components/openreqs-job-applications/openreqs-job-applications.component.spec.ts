import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenreqsJobApplicationsComponent } from './openreqs-job-applications.component';

describe('OpenreqsJobApplicationsComponent', () => {
  let component: OpenreqsJobApplicationsComponent;
  let fixture: ComponentFixture<OpenreqsJobApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OpenreqsJobApplicationsComponent]
    });
    fixture = TestBed.createComponent(OpenreqsJobApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
