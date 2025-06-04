import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedInProfilesComponent } from './linked-in-profiles.component';

describe('LinkedInProfilesComponent', () => {
  let component: LinkedInProfilesComponent;
  let fixture: ComponentFixture<LinkedInProfilesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkedInProfilesComponent]
    });
    fixture = TestBed.createComponent(LinkedInProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
