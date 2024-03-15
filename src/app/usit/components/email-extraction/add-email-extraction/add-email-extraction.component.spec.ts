import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmailExtractionComponent } from './add-email-extraction.component';

describe('AddEmailExtractionComponent', () => {
  let component: AddEmailExtractionComponent;
  let fixture: ComponentFixture<AddEmailExtractionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddEmailExtractionComponent]
    });
    fixture = TestBed.createComponent(AddEmailExtractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
