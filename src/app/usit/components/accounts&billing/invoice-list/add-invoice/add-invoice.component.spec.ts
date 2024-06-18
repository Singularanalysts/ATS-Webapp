import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvoiceComponent } from './add-invoice.component';

describe('AddInvoiceComponent', () => {
  let component: AddInvoiceComponent;
  let fixture: ComponentFixture<AddInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddInvoiceComponent]
    });
    fixture = TestBed.createComponent(AddInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
