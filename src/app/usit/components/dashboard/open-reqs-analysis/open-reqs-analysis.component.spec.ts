import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenReqsAnalysisComponent } from './open-reqs-analysis.component';

describe('OpenReqsAnalysisComponent', () => {
  let component: OpenReqsAnalysisComponent;
  let fixture: ComponentFixture<OpenReqsAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OpenReqsAnalysisComponent]
    });
    fixture = TestBed.createComponent(OpenReqsAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
