import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractmailComponent } from './extractmail.component';

describe('ExtractmailComponent', () => {
  let component: ExtractmailComponent;
  let fixture: ComponentFixture<ExtractmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExtractmailComponent]
    });
    fixture = TestBed.createComponent(ExtractmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
