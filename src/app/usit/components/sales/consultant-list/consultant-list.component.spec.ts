import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantListComponent } from './consultant-list.component';

describe('ConsultantListComponent', () => {
  let component: ConsultantListComponent;
  let fixture: ComponentFixture<ConsultantListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsultantListComponent]
    });
    fixture = TestBed.createComponent(ConsultantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
