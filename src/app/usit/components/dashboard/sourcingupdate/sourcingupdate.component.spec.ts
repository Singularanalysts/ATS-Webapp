import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcingupdateComponent } from './sourcingupdate.component';

describe('SourcingupdateComponent', () => {
  let component: SourcingupdateComponent;
  let fixture: ComponentFixture<SourcingupdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SourcingupdateComponent]
    });
    fixture = TestBed.createComponent(SourcingupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
