import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnaprecruitRequirementsComponent } from './snaprecruit-requirements.component';

describe('SnaprecruitRequirementsComponent', () => {
  let component: SnaprecruitRequirementsComponent;
  let fixture: ComponentFixture<SnaprecruitRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SnaprecruitRequirementsComponent]
    });
    fixture = TestBed.createComponent(SnaprecruitRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
