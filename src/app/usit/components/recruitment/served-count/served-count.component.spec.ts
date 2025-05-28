import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServedCountComponent } from './served-count.component';

describe('ServedCountComponent', () => {
  let component: ServedCountComponent;
  let fixture: ComponentFixture<ServedCountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServedCountComponent]
    });
    fixture = TestBed.createComponent(ServedCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
