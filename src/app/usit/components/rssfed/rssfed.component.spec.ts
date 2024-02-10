import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RssfedComponent } from './rssfed.component';

describe('RssfedComponent', () => {
  let component: RssfedComponent;
  let fixture: ComponentFixture<RssfedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RssfedComponent]
    });
    fixture = TestBed.createComponent(RssfedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
