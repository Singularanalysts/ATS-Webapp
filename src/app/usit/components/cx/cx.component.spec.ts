import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CxComponent } from './cx.component';

describe('CxComponent', () => {
  let component: CxComponent;
  let fixture: ComponentFixture<CxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CxComponent]
    });
    fixture = TestBed.createComponent(CxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
