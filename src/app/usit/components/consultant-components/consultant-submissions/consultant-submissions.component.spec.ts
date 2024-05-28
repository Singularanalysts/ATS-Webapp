import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantSubmissionsComponent } from './consultant-submissions.component';

describe('ConsultantSubmissionsComponent', () => {
  let component: ConsultantSubmissionsComponent;
  let fixture: ComponentFixture<ConsultantSubmissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsultantSubmissionsComponent]
    });
    fixture = TestBed.createComponent(ConsultantSubmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
