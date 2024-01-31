import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterListComponent } from './recruiter-list.component';

describe('RecruiterListComponent', () => {
  let component: RecruiterListComponent;
  let fixture: ComponentFixture<RecruiterListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecruiterListComponent]
    });
    fixture = TestBed.createComponent(RecruiterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
