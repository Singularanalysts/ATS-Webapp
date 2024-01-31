import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadCrumbsComponent } from './bread-crumbs.component';

describe('BreadCrumbsComponent', () => {
  let component: BreadCrumbsComponent;
  let fixture: ComponentFixture<BreadCrumbsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BreadCrumbsComponent]
    });
    fixture = TestBed.createComponent(BreadCrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
