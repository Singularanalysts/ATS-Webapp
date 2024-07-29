import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSourcingConsultantComponent } from './add-sourcing-consultant.component';

describe('AddSourcingConsultantComponent', () => {
  let component: AddSourcingConsultantComponent;
  let fixture: ComponentFixture<AddSourcingConsultantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddSourcingConsultantComponent]
    });
    fixture = TestBed.createComponent(AddSourcingConsultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
