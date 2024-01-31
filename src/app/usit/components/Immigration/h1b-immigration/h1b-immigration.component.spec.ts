import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H1bImmigrationComponent } from './h1b-immigration.component';

describe('H1bImmigrationComponent', () => {
  let component: H1bImmigrationComponent;
  let fixture: ComponentFixture<H1bImmigrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [H1bImmigrationComponent]
    });
    fixture = TestBed.createComponent(H1bImmigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
