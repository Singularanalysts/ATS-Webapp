import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchProfileJobDescriptionComponent } from './match-profile-job-description.component';

describe('MatchProfileJobDescriptionComponent', () => {
  let component: MatchProfileJobDescriptionComponent;
  let fixture: ComponentFixture<MatchProfileJobDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatchProfileJobDescriptionComponent]
    });
    fixture = TestBed.createComponent(MatchProfileJobDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
