import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitNetRequirementsComponent } from './recruit.net-requirements.component';

describe('RecruitNetRequirementsComponent', () => {
  let component: RecruitNetRequirementsComponent;
  let fixture: ComponentFixture<RecruitNetRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecruitNetRequirementsComponent]
    });
    fixture = TestBed.createComponent(RecruitNetRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
