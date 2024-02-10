import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenreqsComponent } from './openreqs.component';

describe('OpenreqsComponent', () => {
  let component: OpenreqsComponent;
  let fixture: ComponentFixture<OpenreqsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenreqsComponent]
    });
    fixture = TestBed.createComponent(OpenreqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
