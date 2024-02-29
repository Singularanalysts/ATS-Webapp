import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosureCountListComponent } from './closure-count-list.component';

describe('ClosureCountListComponent', () => {
  let component: ClosureCountListComponent;
  let fixture: ComponentFixture<ClosureCountListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClosureCountListComponent]
    });
    fixture = TestBed.createComponent(ClosureCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
