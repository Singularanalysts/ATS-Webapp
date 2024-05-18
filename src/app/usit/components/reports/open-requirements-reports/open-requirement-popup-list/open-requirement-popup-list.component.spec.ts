import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRequirementPopupListComponent } from './open-requirement-popup-list.component';

describe('OpenRequirementPopupListComponent', () => {
  let component: OpenRequirementPopupListComponent;
  let fixture: ComponentFixture<OpenRequirementPopupListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OpenRequirementPopupListComponent]
    });
    fixture = TestBed.createComponent(OpenRequirementPopupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
