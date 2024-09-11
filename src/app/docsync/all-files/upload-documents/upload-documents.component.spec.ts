import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentsComponent } from './upload-documents.component';

describe('UploadDocumentsComponent', () => {
  let component: UploadDocumentsComponent;
  let fixture: ComponentFixture<UploadDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UploadDocumentsComponent]
    });
    fixture = TestBed.createComponent(UploadDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
