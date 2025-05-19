import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OpenreqService } from '../../services/openreq.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { DialogService } from 'src/app/services/dialog.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { H1bImmigrantService } from '../../services/h1b-immigrant.service';
import { IConfirmDialogData } from 'src/app/dialogs/models/confirm-dialog-data';
import { ConfirmComponent } from 'src/app/dialogs/confirm/confirm.component';
@Component({
  selector: 'app-associated-companies',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './associated-companies.component.html',
  styleUrls: ['./associated-companies.component.scss'],
})
export class AssociatedCompaniesComponent {
  // role!: string;
  // immigratonServ = inject(H1bImmigrantService);
  // companyList: { id: number; name: string }[] = [];
  // savedData: any[] = [];

  // form: FormGroup;

  // constructor(private fb: FormBuilder) {
  //   this.form = this.fb.group({
  //     rows: this.fb.array([]),
  //   });
  //   this.addRow(); // Add one row initially
  // }

  // ngOnInit() {
  //   this.role = localStorage.getItem('role') || '';
  //   this.getCompanies();
  //   this.getAllCompanies();
  // }

  // get rows(): FormArray {
  //   return this.form.get('rows') as FormArray;
  // }

  // get rowsControls() {
  //   return this.rows.controls;
  // }

  // addRow(): void {
  //   const row = this.fb.group({
  //     company: ['', Validators.required],
  //     associatedCompany: ['', Validators.required],
  //     isSaved: [false],
  //   });
  //   this.rows.push(row);
  // }

  // onCompanyChange(index: number): void {
  //   this.rows.at(index).get('associatedCompany')?.reset();
  // }

  // saveRow(index: number): void {
  //   const row = this.rows.at(index);

  //   if (!row.valid) {
  //     row.markAllAsTouched();
  //     alert('Please select both Company and Associated Company before saving.');
  //     return;
  //   }

  //   const companyId = row.get('company')?.value;
  //   const associatedCompanyId = row.get('associatedCompany')?.value;

  //   const companyName =
  //     this.companyList.find((c) => c.id === companyId)?.name || 'N/A';
  //   const associatedCompanyName =
  //     this.companyList.find((c) => c.id === associatedCompanyId)?.name || 'N/A';

  //   alert(
  //     `Company ID: ${companyId}\n` +
  //       `Company Name: ${companyName}\n` +
  //       `Associated Company ID: ${associatedCompanyId}\n` +
  //       `Associated Company Name: ${associatedCompanyName}`
  //   );

  //   const payload = {
  //     aCid: associatedCompanyId,
  //     company: {
  //       companyid: companyId,
  //     },
  //   };

  //   this.immigratonServ.saveCompanies(payload).subscribe({
  //     next: (response: any) => {
  //       // Assuming your API returns { status: 'success', ... }
  //       if (response.status === 'success') {
  //         row.get('isSaved')?.setValue(true);
  //         this.savedData.push(row.value);
  //         alert('Company association saved successfully');
  //         console.log('Company association saved successfully:', response);
  //       } else {
  //         alert('Failed to save company association. Please try again.');
  //         console.error('Save failed with response:', response);
  //       }
  //     },
  //     error: (err) => {
  //       alert('Error saving company association. Please try again later.');
  //       console.error('Error saving company association:', err);
  //     },
  //   });
  // }

  // removeRow(index: number): void {
  //   this.rows.removeAt(index);
  //   if (this.rows.length === 0) {
  //     this.addRow();
  //   }
  // }

  // deleteRow(index: number): void {
  //   const row = this.rows.at(index);
  //   const companyId = row.get('company')?.value;
  //   const associatedCompanyId = row.get('associatedCompany')?.value;

  //   const payload = {
  //     aCid: associatedCompanyId,
  //     company: {
  //       companyid: companyId,
  //     },
  //   };

  //   this.immigratonServ.deleteCompany(payload.aCid).subscribe({
  //     next: (response: any) => {
  //       // Check if deletion was successful
  //       if (response.status === 'success') {
  //         console.log('Association deleted successfully.');
  //         alert('Deleted');

  //         // Remove from savedData
  //         this.savedData = this.savedData.filter(
  //           (d) =>
  //             !(
  //               d.company === companyId &&
  //               d.associatedCompany === associatedCompanyId
  //             )
  //         );

  //         // Remove row from form
  //         this.rows.removeAt(index);

  //         // Ensure at least one row remains
  //         if (this.rows.length === 0) {
  //           this.addRow();
  //         }
  //       } else {
  //         alert('Failed to delete the association.');
  //         console.error('Deletion failed:', response);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error deleting association:', err);
  //       alert('Failed to delete the association.');
  //     },
  //   });
  // }

  // getCompanies() {
  //   this.immigratonServ.getCompanies().subscribe({
  //     next: (response: any) => {
  //       this.companyList = response.map(([id, name]: [number, string]) => ({
  //         id,
  //         name,
  //       }));
  //     },
  //     error: (err) => {
  //       console.error('Error fetching companies:', err);
  //     },
  //   });
  // }

  // getAssociatedCompaniesOptions(selectedCompanyId: number) {
  //   return this.companyList.filter(
  //     (company) => company.id !== selectedCompanyId
  //   );
  // }

  // getAllCompanies() {
  //   return this.immigratonServ.getAllCompanies().subscribe({
  //     next: () => {

  //     },
  //     error: (err) => {

  //     },
  //   });
  // }

  private snackBarServ = inject(SnackBarService);
  role!: string;
  form: FormGroup;
  savedData: any[] = [];
  private dialogServ = inject(DialogService);
  private dialog = inject(MatDialog);
  companyList: { id: number; name: string }[] = [];

  immigratonServ = inject(H1bImmigrantService);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.role = localStorage.getItem('role') || '';
    this.getCompanies();
    this.getAllCompanies();
    this.addRow(); // only one row for adding new association
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  get rowsControls() {
    return this.rows.controls;
  }

  addRow(): void {
    const row = this.fb.group({
      company: ['', Validators.required],
      associatedCompany: ['', Validators.required],
    });
    this.rows.push(row);
  }

  saveRow(index: number): void {
    const row = this.rows.at(index);

    if (!row.valid) {
      row.markAllAsTouched();

      const snackBarData: ISnackBarData = {
        message:
          'Please select both Company and Associated Company before saving.',
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        direction: 'above', // If supported in your custom component
        panelClass: ['custom-snack-failure'],
      };

      this.snackBarServ.openSnackBarFromComponent(snackBarData);
      return;
    }

    const payload = {
      aCid: row.get('associatedCompany')?.value,
      company: {
        companyid: row.get('company')?.value,
      },
    };

    this.immigratonServ.saveCompanies(payload).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          // alert('Company association saved successfully');
          const snackBarData: ISnackBarData = {
            message: 'Company association saved successfully',
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-success'],
          };

          this.snackBarServ.openSnackBarFromComponent(snackBarData);

          // ✅ Properly reset form state
          this.form.setControl('rows', this.fb.array([]));
          this.addRow();

          // Refresh saved associations
          this.getAllCompanies();
        } else {
          // alert('Failed to save company association.');
          const snackBarData: ISnackBarData = {
            message: 'Failed to save company association.',
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            direction: 'above',
            panelClass: ['custom-snack-failure'],
          };
          this.snackBarServ.openSnackBarFromComponent(snackBarData);
        }
      },
      error: (err) => {
        console.error('Error saving company association:', err);
        // alert('Failed to save company association.');
        const snackBarData: ISnackBarData = {
          message: 'Failed to save company association.',
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          direction: 'above',
          panelClass: ['custom-snack-failure'],
        };
        this.snackBarServ.openSnackBarFromComponent(snackBarData);
      },
    });
  }

  // deleteAssociation(aCid: number): void {
  //   this.immigratonServ.deleteCompany(aCid).subscribe({
  //     next: (response: any) => {
  //       if (response.status === 'success') {
  //         // alert('Association deleted successfully');
  //         const snackBarData: ISnackBarData = {
  //           message: 'Association deleted successfully',
  //           duration: 3000,
  //           verticalPosition: 'top',
  //           horizontalPosition: 'center',
  //           direction: 'above',
  //           panelClass: ['custom-snack-success'],
  //         };

  //         this.snackBarServ.openSnackBarFromComponent(snackBarData);
  //         this.savedData = this.savedData.filter((d) => d.a_cid !== aCid);
  //       } else {
  //         // alert('Failed to delete association.');
  //         const snackBarData: ISnackBarData = {
  //           message: 'Failed to delete association.',
  //           duration: 1500,
  //           verticalPosition: 'top',
  //           horizontalPosition: 'center',
  //           direction: 'above',
  //           panelClass: ['custom-snack-failure'],
  //         };
  //         this.snackBarServ.openSnackBarFromComponent(snackBarData);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error deleting association:', err);
  //       // alert('Failed to delete association.');
  //       const snackBarData: ISnackBarData = {
  //         message: 'Failed to delete association.',
  //         duration: 1500,
  //         verticalPosition: 'top',
  //         horizontalPosition: 'center',
  //         direction: 'above',
  //         panelClass: ['custom-snack-failure'],
  //       };
  //       this.snackBarServ.openSnackBarFromComponent(snackBarData);
  //     },
  //   });
  // }

  deleteAssociation(aCid: number): void {
  const dataToBeSentToDialog: Partial<IConfirmDialogData> = {
    title: 'Confirmation',
    message: 'Are you sure you want to delete this association?',
    confirmText: 'Yes',
    cancelText: 'No',
    actionData: aCid,
  };

  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = 'fit-content';
  dialogConfig.height = 'auto';
  dialogConfig.disableClose = false;
  dialogConfig.panelClass = 'delete-association';
  dialogConfig.data = dataToBeSentToDialog;

  const dialogRef = this.dialogServ.openDialogWithComponent(
    ConfirmComponent,
    dialogConfig
  );

  dialogRef.afterClosed().subscribe({
    next: () => {
      if (dialogRef.componentInstance.allowAction) {
        const snackBarData: ISnackBarData = {
          message: '',
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          direction: 'above',
          panelClass: ['custom-snack-success'],
        };

        this.immigratonServ.deleteCompany(aCid).subscribe({
          next: (response: any) => {
            if (response.status === 'success') {
              this.savedData = this.savedData.filter(d => d.a_cid !== aCid);
              snackBarData.message = 'Association deleted successfully';
            } else {
              snackBarData.panelClass = ['custom-snack-failure'];
              snackBarData.message = response.message || 'Failed to delete association.';
            }
            this.snackBarServ.openSnackBarFromComponent(snackBarData);
          },
          error: (err) => {
            snackBarData.message = err.message || 'Failed to delete association.';
            snackBarData.panelClass = ['custom-snack-failure'];
            this.snackBarServ.openSnackBarFromComponent(snackBarData);
          },
        });
      }
    },
  });
}

  getCompanies() {
    this.immigratonServ.getCompanies().subscribe({
      next: (response: any) => {
        this.companyList = response.map(([id, name]: [number, string]) => ({
          id,
          name,
        }));
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
      },
    });
  }

  getAllCompanies() {
    this.immigratonServ.getAllCompanies().subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          this.savedData = response.data;
        }
      },
      error: (err) => {
        console.error('Error fetching saved associations:', err);
      },
    });
  }

  getCompanyNameById(id: number): string {
    return (
      this.companyList.find((c) => c.id === Number(id))?.name || String(id)
    );
  }

  getAssociatedCompaniesOptions(selectedCompanyId: number) {
    return this.companyList.filter(
      (company) => company.id !== selectedCompanyId
    );
  }
}
