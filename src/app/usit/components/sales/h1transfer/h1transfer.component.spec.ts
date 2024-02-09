import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H1transferComponent } from './h1transfer.component';

describe('H1transferComponent', () => {
  let component: H1transferComponent;
  let fixture: ComponentFixture<H1transferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [H1transferComponent]
    });
    fixture = TestBed.createComponent(H1transferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
