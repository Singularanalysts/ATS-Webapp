import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotListProvidersListComponent } from './hot-list-providers-list.component';

describe('HotListProvidersListComponent', () => {
  let component: HotListProvidersListComponent;
  let fixture: ComponentFixture<HotListProvidersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HotListProvidersListComponent]
    });
    fixture = TestBed.createComponent(HotListProvidersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
