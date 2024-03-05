import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdzunaRequirementsComponent } from './adzuna-requirements.component';

describe('AdzunaRequirementsComponent', () => {
  let component: AdzunaRequirementsComponent;
  let fixture: ComponentFixture<AdzunaRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdzunaRequirementsComponent]
    });
    fixture = TestBed.createComponent(AdzunaRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
