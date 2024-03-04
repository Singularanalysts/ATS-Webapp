import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinRequirementsComponent } from './linkedin-requirements.component';

describe('LinkedinRequirementsComponent', () => {
  let component: LinkedinRequirementsComponent;
  let fixture: ComponentFixture<LinkedinRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LinkedinRequirementsComponent]
    });
    fixture = TestBed.createComponent(LinkedinRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
