import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamFlowComponent } from './team-flow.component';

describe('TeamFlowComponent', () => {
  let component: TeamFlowComponent;
  let fixture: ComponentFixture<TeamFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamFlowComponent]
    });
    fixture = TestBed.createComponent(TeamFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
