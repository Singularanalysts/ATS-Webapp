import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadVmsExcelComponent } from './upload-vms-excel.component';

describe('UploadVmsExcelComponent', () => {
  let component: UploadVmsExcelComponent;
  let fixture: ComponentFixture<UploadVmsExcelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UploadVmsExcelComponent]
    });
    fixture = TestBed.createComponent(UploadVmsExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
