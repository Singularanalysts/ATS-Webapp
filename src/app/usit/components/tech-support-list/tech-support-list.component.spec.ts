import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechSupportListComponent } from './tech-support-list.component';

describe('TechSupportListComponent', () => {
  let component: TechSupportListComponent;
  let fixture: ComponentFixture<TechSupportListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TechSupportListComponent]
    });
    fixture = TestBed.createComponent(TechSupportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
