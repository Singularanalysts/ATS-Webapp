import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndeedRequirementsComponent } from './indeed-requirements.component';

describe('IndeedRequirementsComponent', () => {
  let component: IndeedRequirementsComponent;
  let fixture: ComponentFixture<IndeedRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IndeedRequirementsComponent]
    });
    fixture = TestBed.createComponent(IndeedRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
