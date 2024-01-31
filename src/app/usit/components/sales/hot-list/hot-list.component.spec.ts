import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotListComponent } from './hot-list.component';

describe('HotListComponent', () => {
  let component: HotListComponent;
  let fixture: ComponentFixture<HotListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HotListComponent]
    });
    fixture = TestBed.createComponent(HotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
