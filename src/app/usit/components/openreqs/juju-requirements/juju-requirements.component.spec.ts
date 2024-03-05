import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JujuRequirementsComponent } from './juju-requirements.component';

describe('JujuRequirementsComponent', () => {
  let component: JujuRequirementsComponent;
  let fixture: ComponentFixture<JujuRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JujuRequirementsComponent]
    });
    fixture = TestBed.createComponent(JujuRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
