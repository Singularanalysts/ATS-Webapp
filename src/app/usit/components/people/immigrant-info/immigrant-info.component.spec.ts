import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmigrantInfoComponent } from './immigrant-info.component';

describe('ImmigrantInfoComponent', () => {
  let component: ImmigrantInfoComponent;
  let fixture: ComponentFixture<ImmigrantInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ImmigrantInfoComponent]
    });
    fixture = TestBed.createComponent(ImmigrantInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
