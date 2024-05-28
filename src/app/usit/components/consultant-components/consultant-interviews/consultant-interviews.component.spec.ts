import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantInterviewsComponent } from './consultant-interviews.component';

describe('ConsultantInterviewsComponent', () => {
  let component: ConsultantInterviewsComponent;
  let fixture: ComponentFixture<ConsultantInterviewsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsultantInterviewsComponent]
    });
    fixture = TestBed.createComponent(ConsultantInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
