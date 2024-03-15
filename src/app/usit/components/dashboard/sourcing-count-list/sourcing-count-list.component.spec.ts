import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcingCountListComponent } from './sourcing-count-list.component';

describe('SourcingCountListComponent', () => {
  let component: SourcingCountListComponent;
  let fixture: ComponentFixture<SourcingCountListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SourcingCountListComponent]
    });
    fixture = TestBed.createComponent(SourcingCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
