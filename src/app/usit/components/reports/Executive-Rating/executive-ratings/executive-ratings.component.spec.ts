import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveRatingsComponent } from './executive-ratings.component';

describe('ExecutiveRatingsComponent', () => {
  let component: ExecutiveRatingsComponent;
  let fixture: ComponentFixture<ExecutiveRatingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExecutiveRatingsComponent]
    });
    fixture = TestBed.createComponent(ExecutiveRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
