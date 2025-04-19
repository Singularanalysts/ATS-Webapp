import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H1BVendorsComponent } from './h1-b-vendors.component';

describe('H1BVendorsComponent', () => {
  let component: H1BVendorsComponent;
  let fixture: ComponentFixture<H1BVendorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [H1BVendorsComponent]
    });
    fixture = TestBed.createComponent(H1BVendorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
