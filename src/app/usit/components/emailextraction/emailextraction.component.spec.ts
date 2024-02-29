import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailextractionComponent } from './emailextraction.component';

describe('EmailextractionComponent', () => {
  let component: EmailextractionComponent;
  let fixture: ComponentFixture<EmailextractionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmailextractionComponent]
    });
    fixture = TestBed.createComponent(EmailextractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
