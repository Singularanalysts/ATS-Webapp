import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationListComponent } from './qualification-list.component';

describe('QualificationListComponent', () => {
  let component: QualificationListComponent;
  let fixture: ComponentFixture<QualificationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualificationListComponent]
    });
    fixture = TestBed.createComponent(QualificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
