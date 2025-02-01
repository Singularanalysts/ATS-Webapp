import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaggedcountReportComponent } from './taggedcount-report.component';

describe('TaggedcountReportComponent', () => {
  let component: TaggedcountReportComponent;
  let fixture: ComponentFixture<TaggedcountReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaggedcountReportComponent]
    });
    fixture = TestBed.createComponent(TaggedcountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
