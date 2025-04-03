import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeApplicationComponent } from './resume-application.component';

describe('ResumeApplicationComponent', () => {
  let component: ResumeApplicationComponent;
  let fixture: ComponentFixture<ResumeApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumeApplicationComponent]
    });
    fixture = TestBed.createComponent(ResumeApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
