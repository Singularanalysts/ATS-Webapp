import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { map, Observable, startWith, Subject, takeUntil, tap } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-job-application-comments',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatChipsModule,
    MatTableModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './job-application-comments.component.html',
  styleUrls: ['./job-application-comments.component.scss']
})
export class JobApplicationCommentsComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  
  dialogRef = inject(MatDialogRef<JobApplicationCommentsComponent>);
  private openServ = inject(OpenreqService);
  jobApplyCommentsForm: any = FormGroup;
  private formBuilder = inject(FormBuilder);
  private snackBarServ = inject(SnackBarService);
  dataSource = new MatTableDataSource<any>([]);
  dataTableColumns: string[] = [
    'SerialNum',
    'consultantName',
    'Status',
    'Comment',
    'CommentedBy',
    'CommentedDate',
    'Action'
  ];
  entity: any;
  currentPageIndex = 0;
  private destroyed$ = new Subject<void>();
  searchConsultantOptions$!: Observable<any>;
  consultantData: any[] = [];
  filteredConsultants: any[] = [];
  consultantOptions: any[] = [];
  selectedConsultant: any;
  dataToBeSentToSnackBar: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  selectedConsultantId: any;
  userId!: string | null;
  dialogServ: any;
  submitted: any;
  isEdit!: boolean;
  commentData: any;

  // ngOnInit(): void {
  //   this.userId = localStorage.getItem('userid');
  //   this.getAll();
  //   this.initializeJobApplicationCommentsForm(null);
  //   this.searchConsultantOptions$ = this.openServ.getHotlist().pipe(map((x: any) => x.data), tap(resp => {
  //     if (resp && resp.length) {
  //       this.getConsultantOptionsForAutoComplete(resp);
  //     }
  //   }));
  // }

ngOnInit(): void {
  this.userId = localStorage.getItem('userid');

  if (this.data?.jobData?.id || this.data?.jobData?.requirement?.id) {
    this.getAll();
  } else {
    console.warn('Job data not available in ngOnInit');
  }

  this.initializeJobApplicationCommentsForm(null);

  this.searchConsultantOptions$ = this.openServ.getHotlist(this.userId).pipe(
    map((x: any) => x.data),
    tap(resp => {
      if (resp && resp.length) {
        this.getConsultantOptionsForAutoComplete(resp);
      }
    })
  );
  console.log(this.data?.jobData?.id,'this.data?.jobData?.requirement?.id');
  
}

  getConsultantOptionsForAutoComplete(data: any) {
    this.consultantOptions = data;
    this.searchConsultantOptions$ =
      this.jobApplyCommentsForm.get('consultantId').valueChanges.pipe(
        startWith(''),
        map((value: any) =>
          this.filterConsultants({ consultantname: value } || '', this.consultantOptions)
        )
      );
  }

  filterConsultants(value: any, options: any): string[] {
    if (!value || !value.consultantname) {
      return options;
    }
    const filterValue = value.consultantname.toLowerCase();
    const filteredData = options.filter((option: any) =>
      option.consultantname.toLowerCase().includes(filterValue)
    );
    return filteredData;
  }

  // getAll() {
  //   this.openServ.jobComments(this.data.jobData.requirement.id)
  //     .pipe(takeUntil(this.destroyed$)).subscribe(
  //       (response: any) => {
  //         this.entity = response.data;
  //         this.dataSource.data = response.data;
  //         // for serial-num {}
  //         this.dataSource.data.map((x: any, i) => {
  //           x.serialNum = this.generateSerialNumber(i);
  //         });
  //       }
  //     )
  // }
getAll() {
  const reqId =
    this.data?.jobData?.id || // From CPV Portal Requirements
    this.data?.jobData?.requirement?.id || // From other component structure
    '';  if (!reqId) {
    console.error('Requirement ID not available');
    return;
  }

  this.openServ.jobComments(reqId)
    .pipe(takeUntil(this.destroyed$))
    .subscribe((response: any) => {
      this.entity = response.data;
      this.dataSource.data = response.data;
      this.dataSource.data.forEach((x: any, i) => {
        x.serialNum = this.generateSerialNumber(i);
      });
    });
}

  generateSerialNumber(index: number): number {
    const pagIdx = this.currentPageIndex === 0 ? 1 : this.currentPageIndex + 1;
    const serialNumber = (pagIdx - 1) * 50 + index + 1;
    return serialNumber;
  }
private initializeJobApplicationCommentsForm(data: any) {
  // ✅ Conditionally pick ID based on presence
  const reqId =
    this.data?.jobData?.id || // From CPV Portal Requirements
    this.data?.jobData?.requirement?.id || // From other component structure
    '';

  this.jobApplyCommentsForm = this.formBuilder.group({
    reqId: [reqId, Validators.required],
    consultantId: [data ? data.consultantname : '', Validators.required],
    issueType: [data ? data.issue_type : '', Validators.required],
    comment: [data ? data.comment : '', Validators.required],
    commentedBy: [this.userId, Validators.required],
    commentId: [data ? data.comment_id : ''],
  });
}

preventLeadingSpace(event: Event): void {
  const keyboardEvent = event as KeyboardEvent; // type assertion

  const input = (keyboardEvent.target as HTMLTextAreaElement).value;
  if (input.length === 0 && keyboardEvent.code === 'Space') {
    keyboardEvent.preventDefault();
  }
}



  onSubmit() {
    if (this.jobApplyCommentsForm.invalid) {
      this.jobApplyCommentsForm.markAllAsTouched();
      console.log(this.jobApplyCommentsForm.value ,'this.jobApplyCommentsForm');
      
      return;
    }

    this.submitted = true;

    const selectedValue = this.jobApplyCommentsForm.get('consultantId').value;

    if (this.isEdit) {
      this.selectedConsultantId = this.commentData.consultantid

    } else {
      const selectedOption = this.consultantOptions.find(option => option.consultantname === selectedValue);

      if (selectedOption) {
        this.selectedConsultantId = selectedOption.consultantid;
      }


      
    }


    const formData = this.jobApplyCommentsForm.value;

    const saveCommentObj = {
      reqId: formData.reqId,
      consultantId: this.selectedConsultantId,
      issueType: formData.issueType,
      comment: formData.comment,
      commentedBy: formData.commentedBy,
      commentId: formData.commentId
    };

    this.openServ.addComment(saveCommentObj).subscribe({
      next: (resp: any) => {
        if (resp.status == 'success') {
          this.dataToBeSentToSnackBar.message = 'Comment added successfully';
          this.jobApplyCommentsForm.reset();
          this.onCancel()
          // this.getAll();
        } else {
          this.dataToBeSentToSnackBar.message = resp.message;
          this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        }
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      },
      error: () => {
        this.dataToBeSentToSnackBar.message = 'Comment addition failed';
        this.dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
        this.snackBarServ.openSnackBarFromComponent(this.dataToBeSentToSnackBar);
      },
    })
  }

  editComment(comment: any) {
    this.initializeJobApplicationCommentsForm(comment)
    this.isEdit=true;
    this.commentData=comment;


    

    this.searchConsultantOptions$ = this.openServ.getHotlist(this.userId).pipe(map((x: any) => x.data), tap(resp => {
      if (resp && resp.length) {
        this.getConsultantOptionsForAutoComplete(resp);
      }
    }));


  }

 


  onCancel() {
    this.dialogRef.close();
  }
}
