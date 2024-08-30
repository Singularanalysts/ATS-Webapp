import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmailConfigurationComponent } from './add-email-configuration.component';

describe('AddEmailConfigurationComponent', () => {
  let component: AddEmailConfigurationComponent;
  let fixture: ComponentFixture<AddEmailConfigurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddEmailConfigurationComponent]
    });
    fixture = TestBed.createComponent(AddEmailConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
