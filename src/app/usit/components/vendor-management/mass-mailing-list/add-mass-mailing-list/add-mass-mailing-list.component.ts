import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-mass-mailing-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule
  ],
  templateUrl: './add-mass-mailing-list.component.html',
  styleUrls: ['./add-mass-mailing-list.component.scss']
})
export class AddMassMailingListComponent implements OnInit {

  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddMassMailingListComponent>);
  isFormSubmitted: boolean = false;
  massMailingForm: any = FormGroup;
  private formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeMassMailingForm(null);
  }

  private initializeMassMailingForm(massMailingData: any) {
    this.massMailingForm = this.formBuilder.group({
      technology: [massMailingData ? massMailingData.technology : '', [Validators.required]],
      company: [massMailingData ? massMailingData.company : '', Validators.required],
      email: [massMailingData ? massMailingData.email : '', Validators.required],
      mmtype: [massMailingData ? massMailingData.mmtype : '', Validators.required],
      mmfor: [massMailingData ? massMailingData.mmfor : '', Validators.required],
      name: [massMailingData ? massMailingData.name : '', Validators.required],
    });
  }

  onSubmit() {

  }

  onCancel() {
    this.dialogRef.close();
  }

}
