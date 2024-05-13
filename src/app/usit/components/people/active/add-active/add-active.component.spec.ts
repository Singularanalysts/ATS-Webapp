import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddActiveComponent } from './add-active.component';

describe('AddActiveComponent', () => {
  let component: AddActiveComponent;
  let fixture: ComponentFixture<AddActiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddActiveComponent]
    });
    fixture = TestBed.createComponent(AddActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
