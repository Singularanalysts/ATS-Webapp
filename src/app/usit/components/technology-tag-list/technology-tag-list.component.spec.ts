import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyTagListComponent } from './technology-tag-list.component';

describe('TechnologyTagListComponent', () => {
  let component: TechnologyTagListComponent;
  let fixture: ComponentFixture<TechnologyTagListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TechnologyTagListComponent]
    });
    fixture = TestBed.createComponent(TechnologyTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
