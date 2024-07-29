import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcingClosuresComponent } from './sourcing-closures.component';

describe('SourcingClosuresComponent', () => {
  let component: SourcingClosuresComponent;
  let fixture: ComponentFixture<SourcingClosuresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SourcingClosuresComponent]
    });
    fixture = TestBed.createComponent(SourcingClosuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
