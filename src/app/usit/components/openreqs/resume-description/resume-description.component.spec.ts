import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeDescriptionComponent } from './resume-description.component';

describe('ResumeDescriptionComponent', () => {
  let component: ResumeDescriptionComponent;
  let fixture: ComponentFixture<ResumeDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumeDescriptionComponent]
    });
    fixture = TestBed.createComponent(ResumeDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
