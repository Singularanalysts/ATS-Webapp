import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosureListComponent } from './closure-list.component';

describe('ClosureListComponent', () => {
  let component: ClosureListComponent;
  let fixture: ComponentFixture<ClosureListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClosureListComponent]
    });
    fixture = TestBed.createComponent(ClosureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
