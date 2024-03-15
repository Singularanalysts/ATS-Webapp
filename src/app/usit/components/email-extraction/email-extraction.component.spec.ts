import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailExtractionComponent } from './email-extraction.component';

describe('EmailExtractionComponent', () => {
  let component: EmailExtractionComponent;
  let fixture: ComponentFixture<EmailExtractionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmailExtractionComponent]
    });
    fixture = TestBed.createComponent(EmailExtractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
