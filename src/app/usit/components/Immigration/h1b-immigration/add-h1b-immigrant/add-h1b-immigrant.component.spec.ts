import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddH1bImmigrantComponent } from './add-h1b-immigrant.component';

describe('AddH1bImmigrantComponent', () => {
  let component: AddH1bImmigrantComponent;
  let fixture: ComponentFixture<AddH1bImmigrantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddH1bImmigrantComponent]
    });
    fixture = TestBed.createComponent(AddH1bImmigrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
