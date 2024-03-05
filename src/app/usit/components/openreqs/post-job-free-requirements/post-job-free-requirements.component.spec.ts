import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobFreeRequirementsComponent } from './post-job-free-requirements.component';

describe('PostJobFreeRequirementsComponent', () => {
  let component: PostJobFreeRequirementsComponent;
  let fixture: ComponentFixture<PostJobFreeRequirementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PostJobFreeRequirementsComponent]
    });
    fixture = TestBed.createComponent(PostJobFreeRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
