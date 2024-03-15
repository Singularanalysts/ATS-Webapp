import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobliftRequirementsComponent } from './joblift-requirements.component';

describe('JobliftRequirementsComponent', () => {
  let component: JobliftRequirementsComponent;
  let fixture: ComponentFixture<JobliftRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobliftRequirementsComponent]
    });
    fixture = TestBed.createComponent(JobliftRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
