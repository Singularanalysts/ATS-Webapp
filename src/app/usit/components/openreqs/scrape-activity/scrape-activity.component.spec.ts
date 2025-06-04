import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapeActivityComponent } from './scrape-activity.component';

describe('ScrapeActivityComponent', () => {
  let component: ScrapeActivityComponent;
  let fixture: ComponentFixture<ScrapeActivityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScrapeActivityComponent]
    });
    fixture = TestBed.createComponent(ScrapeActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
