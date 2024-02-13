import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedprofilesComponent } from './linkedprofiles.component';

describe('LinkedprofilesComponent', () => {
  let component: LinkedprofilesComponent;
  let fixture: ComponentFixture<LinkedprofilesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LinkedprofilesComponent]
    });
    fixture = TestBed.createComponent(LinkedprofilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
