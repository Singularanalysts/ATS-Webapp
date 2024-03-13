import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRequirementsReportsComponent } from './open-requirements-reports.component';

describe('OpenRequirementsReportsComponent', () => {
  let component: OpenRequirementsReportsComponent;
  let fixture: ComponentFixture<OpenRequirementsReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OpenRequirementsReportsComponent]
    });
    fixture = TestBed.createComponent(OpenRequirementsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
