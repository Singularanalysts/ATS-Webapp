import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsReportComponent } from './skills-report.component';

describe('SkillsReportComponent', () => {
  let component: SkillsReportComponent;
  let fixture: ComponentFixture<SkillsReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkillsReportComponent]
    });
    fixture = TestBed.createComponent(SkillsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
