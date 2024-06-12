import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpvFpvOpenRequirementsComponent } from './cpv-fpv-open-requirements.component';

describe('CpvFpvOpenRequirementsComponent', () => {
  let component: CpvFpvOpenRequirementsComponent;
  let fixture: ComponentFixture<CpvFpvOpenRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CpvFpvOpenRequirementsComponent]
    });
    fixture = TestBed.createComponent(CpvFpvOpenRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
