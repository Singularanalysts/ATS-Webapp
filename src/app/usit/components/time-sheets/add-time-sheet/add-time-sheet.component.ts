import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { TimeSheet } from 'src/app/usit/models/time-sheet';
import { TechnologyTagService } from 'src/app/usit/services/technology-tag.service';
import { TimeSheetService } from 'src/app/usit/services/time-sheet.service';

@Component({
  selector: 'app-add-time-sheet',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule, // Add MatDatepickerModule
    MatNativeDateModule, // Add MatNativeDateModule
  ],
  templateUrl: './add-time-sheet.component.html',
  styleUrls: ['./add-time-sheet.component.scss']
})

export class AddTimeSheetComponent {
  timesheetForm!: FormGroup;
  private formBuilder = inject(FormBuilder);
  private snackBarServ = inject(SnackBarService);
  private timeTagServ = inject(TimeSheetService);
  timesheetObj: TimeSheet = new TimeSheet();
  allowAction = false;
  attachments: File[] = []; // Update to handle multiple files
  attachmentsError: boolean = false;
  attachmentsFileNameLength: boolean = false;
  existingAttachments: any[] = []; // Placeholder for already uploaded files
  vendorsArr: any[] = [];
  userid!: any;

  constructor(@Inject(MAT_DIALOG_DATA) protected data: any, public dialogRef: MatDialogRef<AddTimeSheetComponent>) { }

  ngOnInit(): void {
    this.initializeTechnologyForm();
    this.getUserId();
    this.getVendor();
    this.loadExistingTimesheetData(); // Load timesheet data if updating

  }
  private loadExistingTimesheetData() {
    // Check if data is passed for an update
    if (this.data && this.data.timesheetData) {
      const timesheetData = this.data.timesheetData.data;
      this.timesheetForm.patchValue({
        vendor: timesheetData.vendorid || '', // Replace with the actual vendor mapping if needed
        timeType: timesheetData.timeSheetType || '',
        startDate: timesheetData.startDate ? new Date(timesheetData.startDate) : '', // Convert to Date object
        endDate: timesheetData.endDate ? new Date(timesheetData.endDate) : '', // Convert to Date object
        hours: timesheetData.numberOfHours || '',
        // Ensure other fields are mapped properly here
        attachments: timesheetData.attachments// Reset attachments as they aren't fetched in the response
      });
      // Populate existing attachments
      if (timesheetData.attachments) {
        this.existingAttachments = timesheetData.attachments;
      }
    }
  }

  private initializeTechnologyForm() {
    this.timesheetForm = this.formBuilder.group({
      id: [''], // Optional, can be excluded if not needed
      vendor: ['', Validators.required], // Vendor is required
      timeType: ['', Validators.required], // Time Type is required
      startDate: ['', Validators.required], // Start Date is required
      endDate: ['', Validators.required], // End Date is required
      hours: ['', [Validators.required, Validators.min(1)]], // Required and must be a positive number
      attachments: [null, Validators.required] // Attachments are required
    });
  }

  get controls() {
    return this.timesheetForm.controls;
  }

  getAttachmentNames(): string {
    return this.attachments && this.attachments.length
      ? this.attachments.map((file: File) => file.name).join(', ')
      : 'No files chosen';
  }
  
  onFileChange(event: any): void {
    const files: FileList = event.target.files;
  
    // Reset error flags
    this.attachmentsError = false;
    this.attachmentsFileNameLength = false;
  
    // Convert FileList to an array and assign to attachments
    this.attachments = Array.from(files);
  
    // Update the value of the 'attachments' FormControl
    this.timesheetForm.patchValue({
      attachments: this.attachments,
    });
  
    // Validate each file and set error flags
    this.attachments.forEach(file => {
      if (file.size > 1 * 1024 * 1024) { // 1MB size limit
        this.attachmentsError = true;
      }
      if (file.name.length > 40) { // 40 characters name length limit
        this.attachmentsFileNameLength = true;
      }
    });
  }
  
  viewAttachment(attachment: any): void {
    alert(`Download service not ready. File: ${attachment.attachmentName}`);
  }

  deleteAttachment(attachmentId: number): void {
    // Remove the attachment from the existingAttachments array
    const index = this.existingAttachments.findIndex(att => att.id === attachmentId);
    if (index !== -1) {
      this.existingAttachments.splice(index, 1);
    }

    // Update the form's attachments field to reflect changes
    this.timesheetForm.patchValue({
      attachments: this.existingAttachments.length > 0 ? this.existingAttachments : []
    });

    // Call API to delete the attachment from the backend
    this.timeTagServ.deleteAttachment(attachmentId).subscribe({
      next: () => {
        const dataToBeSentToSnackBar: ISnackBarData = {
          message: '',
          duration: 1500,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          direction: 'above',
          panelClass: ['custom-snack-success'],
        };
        this.timesheetObj.timesheetId = this.data?.timesheetData?.data?.timesheetId; // Pass the id for updates
        this.timesheetObj.startDate = this.timesheetForm.value.startDate;
        this.timesheetObj.endDate = this.timesheetForm.value.endDate;
        this.timesheetObj.numberOfHours = this.timesheetForm.value.hours;
        this.timesheetObj.timeSheetType = this.timesheetForm.value.timeType;
        
        this.timeTagServ.updateTimeSheet(this.timesheetObj).subscribe({
          next: (response: any) => {
            console.log('Timesheet updated successfully:', response.data.timesheetId);
            dataToBeSentToSnackBar.message = 'Updated Successfully';
            this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
            if (this.attachments.length > 0) {
              const formData = new FormData();
              this.attachments.forEach((file) => formData.append('files', file));
              this.timeTagServ.addAttachments(formData, response.data.timesheetId).subscribe({
                next: (res) => console.log('Attachments uploaded successfully:', res),
                error: (err) => console.error('Error uploading attachments:', err),
              });
            }


          },
          error: (error) => {
            console.log('Error updating timesheet:', error);
          },
        });
      },
      error: (err) => {
        console.error(`Error deleting attachment with ID ${attachmentId}:`, err);
      },
    });
  }


  getUserId() {
    return localStorage.getItem("userid");
  }

  getVendor() {
    const userId = this.getUserId();
    this.timeTagServ.getVendor(userId).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          // Populate the vendorsArr with the response data
          this.vendorsArr = response.data.map((vendor: any) => ({
            vendorid: vendor.vendorid,
            company: vendor.company.trim(), // Trim whitespace from company names
          }));
        } else {
          console.error('Failed to fetch vendor data:', response.message);
        }
      },
      error: (err: any) => {
        console.error('Error fetching vendor:', err);
      },
    });
  }

  onSubmit() {
    this.allowAction = true;
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 1500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };

    // Check if the form is valid
    if (!this.timesheetForm.valid) {
      this.displayFormErrors(); // Highlight invalid fields
      dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
      dataToBeSentToSnackBar.message = 'Please fill out all required fields correctly!';
      this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
      return;
    }

    // Check for file-related errors
    if (this.attachmentsError || this.attachmentsFileNameLength) {
      dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
      dataToBeSentToSnackBar.message = 'Attachments are not valid!';
      this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
      return;
    }

    console.log('Timesheet Object:', this.timesheetObj);

    const selectedVendor = this.timesheetForm.value.vendor; // Selected vendorid from the dropdown
    this.timesheetObj.vendorid = selectedVendor;
    console.log('Timesheet Object:', this.timesheetObj);

    if (this.data && this.data.actionName === 'add-timesheet') {
      this.timesheetObj.startDate = this.timesheetForm.value.startDate;
      this.timesheetObj.endDate = this.timesheetForm.value.endDate;
      this.timesheetObj.numberOfHours = this.timesheetForm.value.hours;
      this.timesheetObj.timeSheetType = this.timesheetForm.value.timeType;

      this.timeTagServ.addTimeSheet(this.timesheetObj).subscribe({
        next: (response: any) => {
          const timesheetId = response.data.timesheetId;
          if (this.attachments.length > 0) {
            const formData = new FormData();
            this.attachments.forEach((file) => formData.append('files', file));
            this.timeTagServ.addAttachments(formData, timesheetId).subscribe({
              next: (res) => {
                dataToBeSentToSnackBar.message = 'Time Sheet Added Successfully';
                this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
              },
              error: (err) => console.log('Error uploading attachments:', err),
            });
          }
          this.getUserId();
          this.dialogRef.close();
        },
        error: (error) => {
          console.log('Error adding timesheet:', error);
        },
      });
    } else if (this.data && this.data.actionName === 'update-timesheet') {
      this.timesheetObj.timesheetId = this.data?.timesheetData?.data?.timesheetId; // Pass the id for updates
      this.timesheetObj.startDate = this.timesheetForm.value.startDate;
      this.timesheetObj.endDate = this.timesheetForm.value.endDate;
      this.timesheetObj.numberOfHours = this.timesheetForm.value.hours;
      this.timesheetObj.timeSheetType = this.timesheetForm.value.timeType;

      this.timeTagServ.updateTimeSheet(this.timesheetObj).subscribe({
        next: (response: any) => {
          console.log('Timesheet updated successfully:', response.data.timesheetId);
          dataToBeSentToSnackBar.message = 'Updated Successfully';
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          if (this.attachments.length > 0) {
            const formData = new FormData();
            this.attachments.forEach((file) => formData.append('files', file));
            this.timeTagServ.addAttachments(formData, response.data.timesheetId).subscribe({
              next: (res) => console.log('Attachments uploaded successfully:', res),
              error: (err) => console.error('Error uploading attachments:', err),
            });
          }

          this.dialogRef.close();
        },
        error: (error) => {
          console.log('Error updating timesheet:', error);
        },
      });
    }
  }

  displayFormErrors() {
    Object.keys(this.timesheetForm.controls).forEach((field) => {
      const control = this.timesheetForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  onAction(type: string): void {
    // Determine if the form is in "update" or "create" mode
    const isUpdate = this.data?.actionName === 'update-timesheet';

    if (isUpdate && this.existingAttachments.length === 0) {

      this.snackBarServ.openSnackBarFromComponent({
        message: 'Please add at least one attachment before closing.',
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['custom-snack-failure'],
      });
      return;
    }
    // Allow dialog to close for both "create" and "update" scenarios if validations pass
    this.dialogRef.close();
  }

}