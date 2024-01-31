import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureOptCptComponent } from './future-opt-cpt.component';

describe('FutureOptCptComponent', () => {
  let component: FutureOptCptComponent;
  let fixture: ComponentFixture<FutureOptCptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FutureOptCptComponent]
    });
    fixture = TestBed.createComponent(FutureOptCptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
