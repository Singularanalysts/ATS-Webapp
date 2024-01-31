import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTechnologyTagComponent } from './add-technology-tag.component';

describe('AddTechnologyTagComponent', () => {
  let component: AddTechnologyTagComponent;
  let fixture: ComponentFixture<AddTechnologyTagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddTechnologyTagComponent]
    });
    fixture = TestBed.createComponent(AddTechnologyTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
