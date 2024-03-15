import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMassMailingListComponent } from './add-mass-mailing-list.component';

describe('AddMassMailingListComponent', () => {
  let component: AddMassMailingListComponent;
  let fixture: ComponentFixture<AddMassMailingListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddMassMailingListComponent]
    });
    fixture = TestBed.createComponent(AddMassMailingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
