import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTechSupportComponent } from './add-tech-support.component';

describe('AddTechSupportComponent', () => {
  let component: AddTechSupportComponent;
  let fixture: ComponentFixture<AddTechSupportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddTechSupportComponent]
    });
    fixture = TestBed.createComponent(AddTechSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
