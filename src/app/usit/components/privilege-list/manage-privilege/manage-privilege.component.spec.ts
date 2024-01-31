import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePrivilegeComponent } from './manage-privilege.component';

describe('ManagePrivilegeComponent', () => {
  let component: ManagePrivilegeComponent;
  let fixture: ComponentFixture<ManagePrivilegeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ManagePrivilegeComponent]
    });
    fixture = TestBed.createComponent(ManagePrivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
