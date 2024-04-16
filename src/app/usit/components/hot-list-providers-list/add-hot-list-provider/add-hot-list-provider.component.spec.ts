import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHotListProviderComponent } from './add-hot-list-provider.component';

describe('AddHotListProviderComponent', () => {
  let component: AddHotListProviderComponent;
  let fixture: ComponentFixture<AddHotListProviderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddHotListProviderComponent]
    });
    fixture = TestBed.createComponent(AddHotListProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
