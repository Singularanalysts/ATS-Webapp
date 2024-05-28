import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantOpenreqsComponent } from './consultant-openreqs.component';

describe('ConsultantOpenreqsComponent', () => {
  let component: ConsultantOpenreqsComponent;
  let fixture: ComponentFixture<ConsultantOpenreqsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsultantOpenreqsComponent]
    });
    fixture = TestBed.createComponent(ConsultantOpenreqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
