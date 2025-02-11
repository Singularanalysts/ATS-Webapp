import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnBlockingEmailsComponent } from './un-blocking-emails.component';

describe('UnBlockingEmailsComponent', () => {
  let component: UnBlockingEmailsComponent;
  let fixture: ComponentFixture<UnBlockingEmailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnBlockingEmailsComponent]
    });
    fixture = TestBed.createComponent(UnBlockingEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
