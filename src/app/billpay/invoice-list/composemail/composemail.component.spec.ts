import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposemailComponent } from './composemail.component';

describe('ComposemailComponent', () => {
  let component: ComposemailComponent;
  let fixture: ComponentFixture<ComposemailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ComposemailComponent]
    });
    fixture = TestBed.createComponent(ComposemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
