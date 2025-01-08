import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantFulltimeOpenreqsComponent } from './consultant-fulltime-openreqs.component';

describe('ConsultantFulltimeOpenreqsComponent', () => {
  let component: ConsultantFulltimeOpenreqsComponent;
  let fixture: ComponentFixture<ConsultantFulltimeOpenreqsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultantFulltimeOpenreqsComponent]
    });
    fixture = TestBed.createComponent(ConsultantFulltimeOpenreqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
