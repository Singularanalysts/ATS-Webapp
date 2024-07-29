import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PursuingComponent } from './pursuing.component';

describe('PursuingComponent', () => {
  let component: PursuingComponent;
  let fixture: ComponentFixture<PursuingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PursuingComponent]
    });
    fixture = TestBed.createComponent(PursuingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
