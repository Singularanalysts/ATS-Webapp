import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantTrackComponent } from './consultant-track.component';

describe('ConsultantTrackComponent', () => {
  let component: ConsultantTrackComponent;
  let fixture: ComponentFixture<ConsultantTrackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsultantTrackComponent]
    });
    fixture = TestBed.createComponent(ConsultantTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
