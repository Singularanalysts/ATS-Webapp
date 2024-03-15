import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassMailingListComponent } from './mass-mailing-list.component';

describe('MassMailingListComponent', () => {
  let component: MassMailingListComponent;
  let fixture: ComponentFixture<MassMailingListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MassMailingListComponent]
    });
    fixture = TestBed.createComponent(MassMailingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
