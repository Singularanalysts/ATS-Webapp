import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplyhiredRquirementsComponent } from './simplyhired-rquirements.component';

describe('SimplyhiredRquirementsComponent', () => {
  let component: SimplyhiredRquirementsComponent;
  let fixture: ComponentFixture<SimplyhiredRquirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SimplyhiredRquirementsComponent]
    });
    fixture = TestBed.createComponent(SimplyhiredRquirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
