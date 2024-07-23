import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientInformationComponent } from './add-client-information.component';

describe('AddClientInformationComponent', () => {
  let component: AddClientInformationComponent;
  let fixture: ComponentFixture<AddClientInformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddClientInformationComponent]
    });
    fixture = TestBed.createComponent(AddClientInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
