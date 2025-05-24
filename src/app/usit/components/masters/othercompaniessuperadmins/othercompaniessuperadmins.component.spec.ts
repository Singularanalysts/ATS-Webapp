import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthercompaniessuperadminsComponent } from './othercompaniessuperadmins.component';

describe('OthercompaniessuperadminsComponent', () => {
  let component: OthercompaniessuperadminsComponent;
  let fixture: ComponentFixture<OthercompaniessuperadminsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OthercompaniessuperadminsComponent]
    });
    fixture = TestBed.createComponent(OthercompaniessuperadminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
