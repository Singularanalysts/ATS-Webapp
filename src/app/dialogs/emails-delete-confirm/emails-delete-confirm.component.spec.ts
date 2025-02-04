import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsDeleteConfirmComponent } from './emails-delete-confirm.component';

describe('EmailsDeleteConfirmComponent', () => {
  let component: EmailsDeleteConfirmComponent;
  let fixture: ComponentFixture<EmailsDeleteConfirmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmailsDeleteConfirmComponent]
    });
    fixture = TestBed.createComponent(EmailsDeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
