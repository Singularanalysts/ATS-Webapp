import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruInfoComponent } from './recru-info.component';

describe('RecruInfoComponent', () => {
  let component: RecruInfoComponent;
  let fixture: ComponentFixture<RecruInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RecruInfoComponent]
    });
    fixture = TestBed.createComponent(RecruInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
