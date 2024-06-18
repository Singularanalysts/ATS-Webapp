import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotListProvidersExcelComponent } from './hot-list-providers-excel.component';

describe('HotListProvidersExcelComponent', () => {
  let component: HotListProvidersExcelComponent;
  let fixture: ComponentFixture<HotListProvidersExcelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HotListProvidersExcelComponent]
    });
    fixture = TestBed.createComponent(HotListProvidersExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
