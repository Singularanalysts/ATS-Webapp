import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsuperadminComponent } from './addsuperadmin.component';

describe('AddsuperadminComponent', () => {
  let component: AddsuperadminComponent;
  let fixture: ComponentFixture<AddsuperadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddsuperadminComponent]
    });
    fixture = TestBed.createComponent(AddsuperadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
