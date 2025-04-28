import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxGpAutocompleteModule } from '@angular-magic/ngx-gp-autocomplete';
import { SearchPipe } from 'src/app/pipes/search.pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, of, startWith, Subject, takeUntil } from 'rxjs';
import { PrivilegesService } from 'src/app/services/privileges.service';

@Component({
  selector: 'app-add-executive-rating',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    SearchPipe,
    MatCardModule,
    NgxMatIntlTelInputComponent,
    NgxGpAutocompleteModule,
    MatRadioModule
  ],
  templateUrl: './add-executive-rating.component.html',
  styleUrls: ['./add-executive-rating.component.scss']
})
export class AddExecutiveRatingComponent {
  ratingForm: FormGroup;
  protected isFormSubmitted: boolean = false;
  searchTeamLeadOptions$!: Observable<any[]>; // Observable for autocomplete
  managerList: any[] = []; // Store fetched manager list
  userId: any = localStorage.getItem('userid') || '';  
  teamleadID: any
  private destroyed$ = new Subject<void>();

  protected privilegeServ = inject(PrivilegesService);
  executiveList: any[] = [];
  searchExecutiveOptions$!: Observable<any[]>;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddExecutiveRatingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.ratingForm = this.formBuilder.group({
      id: [null], 
      teamLead: ['', [Validators.required]],
      ratedTo: [{ value: null, disabled: true }, Validators.required], 
      rating: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      feedBack: ['', [Validators.required, Validators.maxLength(500), this.noWhitespaceValidator]],
      ratedBy: [this.userId, Validators.required],
      manager:[this.userId],
      ratingType: ['', Validators.required], // <-- Added Report Type field

    });


    console.log('Received Data:', data);

    if (data?.interviewData?.id) {
      console.log('interviewidddd',data?.interviewData?.id);

      this.fetchRatingById(data.interviewData.id); 
    }
  }
  noWhitespaceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value?.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }
  
  reportTypes: string[] = ['WEEKLY', 'MONTHLY', 'DAILY'];

onReportTypeSelected(value: string): void {
  this.ratingForm.patchValue({ ratingType: value });
}

  fetchRatingById(id: any) {
    this.privilegeServ.getratingsbyId(id).subscribe({
      next: (response: any) => {
        console.log('Fetched Rating Data:', response.data);
  
        if (!response.data) {
          console.error('Error: No data returned from API.');
          return;
        }
  
        this.getExecutiveDropdown(response.data.teamLead);
  
        setTimeout(() => {
          this.ratingForm.patchValue(response.data);
          this.ratingForm.get('id')?.setValue(response.data.id);

          console.log('After patching:', this.ratingForm.value);
        }, 500);
      },
      error: (error: any) => {
        console.error('Error fetching rating data:', error);
      }
    });
  }
  hideTeamLeadField:any
ngOnInit(): void {
    this.getTeamLeadDropdown();
    
    const userRole = localStorage.getItem('role');
    const userIdFromLocalStorage = localStorage.getItem('userid');
  
    if (userRole === 'Team Leader Sales' || userRole === 'Team Leader Recruiting') {
      this.ratingForm.get('teamLead')?.clearValidators();
      this.ratingForm.get('teamLead')?.updateValueAndValidity();
      this.ratingForm.get('teamLead')?.setValue(userIdFromLocalStorage);
      this.hideTeamLeadField = true;
      
      this.getExecutiveDropdown(Number(userIdFromLocalStorage));
  
      // Enable executive selection and set required validation
      this.ratingForm.get('ratedTo')!.enable();
      this.ratingForm.get('ratedTo')!.setValidators([Validators.required]); // Make required
      this.ratingForm.get('ratedTo')!.updateValueAndValidity();
    } 
    else if (userRole === 'Recruiting Manager' || userRole === 'Sales Manager') {
      // Make ratedTo optional (null allowed)
      this.ratingForm.get('ratedTo')!.clearValidators();
      this.ratingForm.get('ratedTo')!.updateValueAndValidity();
      this.ratingForm.get('ratedTo')!.enable(); // Keep it enabled, but optional
    } 
    else {
      if (!this.ratingForm.get('ratedTo')?.value) {
        this.ratingForm.get('ratedTo')!.disable();
      }
    }
    // Handle teamLead selection changes
    this.ratingForm.get('teamLead')!.valueChanges.subscribe(selectedPseudoName => {
      console.log('Selected TeamLead PseudoName:', selectedPseudoName);
      const selectedTeamLead = this.managerList.find(manager => manager.pseudoName === selectedPseudoName);
  
      if (selectedTeamLead) {
        console.log('Selected TeamLead ID:', selectedTeamLead.id);
        this.getExecutiveDropdown(selectedTeamLead.id);
        this.ratingForm.get('ratedTo')!.enable();
      } else if (!selectedPseudoName) {
        console.warn('No TeamLead selected, disabling Executive field');
        this.executiveList = [];
        this.searchExecutiveOptions$ = of([]); 
        this.ratingForm.get('ratedTo')?.setValue(''); 
        this.ratingForm.get('ratedTo')!.disable();
      }
    });
  
    this.searchTeamLeadOptions$ = this.ratingForm.get('teamLead')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? this.filterTeamLead(value) : this.managerList))
    );
  
    // this.searchExecutiveOptions$ = this.ratingForm.get('ratedTo')!.valueChanges.pipe(
    //   startWith(''),
    //   map(value => (typeof value === 'string' ? this.filterExecutives(value) : this.executiveList))
    // );
    this.searchExecutiveOptions$ = this.ratingForm.get('ratedTo')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? this.filterExecutives(value) : this.executiveList))
    );
    this.ratingForm.get('ratedTo')!.valueChanges.subscribe(value => {
      const isValidSelection = this.executiveList.some(exec => exec.id === value);
    
      if (userRole !== 'Recruiting Manager' && userRole !== 'Sales Manager') {
        if (!isValidSelection) {
          this.ratingForm.get('ratedTo')?.setErrors({ invalidSelection: true });
        } else {
          this.ratingForm.get('ratedTo')?.setErrors(null);
        }
      } else {
        if (value && !isValidSelection) {
          this.ratingForm.get('ratedTo')?.setErrors({ invalidSelection: true });
        } else {
          this.ratingForm.get('ratedTo')?.setErrors(null);
        }
      }
    });
    
    
    this.ratingForm.get('teamLead')!.valueChanges.subscribe(value => {
      const isValidSelection = this.managerList.some(manager => manager.id === value);
      const userRole = localStorage.getItem('role');
    
      if (userRole === 'Recruiting Manager' || userRole === 'Sales Manager') {
        if (!isValidSelection) {
          this.ratingForm.get('teamLead')?.setErrors({ invalidSelection: true });
        } else {
          this.ratingForm.get('teamLead')?.setErrors(null);
        }
      } else {
        this.ratingForm.get('teamLead')?.setErrors(null);
      }
    });
    this.ratingForm.get('ratingType')!.valueChanges.subscribe(value => {
      if (!this.reportTypes.includes(value)) {
        this.ratingForm.get('ratingType')?.setErrors({ invalidSelection: true });
      } else {
        this.ratingForm.get('ratingType')?.setErrors(null);
      }
    });
    
    
  }  
  
  

 getTeamLeadDropdown() {
    this.privilegeServ.getdropdownmanager(this.userId,localStorage.getItem('companyid')).subscribe({
      next: (response: any) => {
        this.managerList = response.data || [];
        console.log(this.managerList, 'managerList');

        this.ratingForm.get('teamLead')!.setValue(this.ratingForm.get('teamLead')!.value || '');
      },
      error: (err: any) => console.error('Error fetching managers:', err)
    });
  }


  // getExecutiveDropdown(teamLeadId?: number) {
  //   this.privilegeServ.getdropdownexecutive(teamLeadId).subscribe({
  //     next: (response: any) => {
  //       this.executiveList = response.data || [];
  //       console.log(this.executiveList, 'executiveList');

  //       this.searchExecutiveOptions$ = of(this.executiveList);

  //       this.ratingForm.get('ratedTo')?.setValue(this.ratingForm.get('ratedTo')!.value || '');
  //     },
  //     error: (err: any) => console.error('Error fetching executives:', err)
  //   });
  // }
  getExecutiveDropdown(teamLeadId?: number) {
    this.privilegeServ.getdropdownexecutive(teamLeadId).subscribe({
      next: (response: any) => {
        this.executiveList = response.data || [];
        console.log(this.executiveList, 'executiveList');
  
        // Reinitialize observable for search functionality
        this.searchExecutiveOptions$ = this.ratingForm.get('ratedTo')!.valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? this.filterExecutives(value) : this.executiveList))
        );
  
        // Set default value if necessary
        this.ratingForm.get('ratedTo')?.setValue(this.ratingForm.get('ratedTo')!.value || '');
      },
      error: (err: any) => console.error('Error fetching executives:', err)
    });
  }
  
  getPseudoName(id: number, list: any[]): string {
    const item = list.find(entry => entry.id === id);
    return item ? item.pseudoName : '';
  }


  private filterTeamLead(value: string) {
    const filterValue = value.toLowerCase();
    const filteredList = this.managerList.filter(option =>
      option.pseudoName.toLowerCase().includes(filterValue)
    );
    console.log('Filtered Team Leads:', filteredList);
    return filteredList;
  }


  // private filterExecutives(value: string): any[] {
  //   console.log('Search Input:', value);

  //   if (!this.executiveList || !Array.isArray(this.executiveList)) {
  //     console.warn('Executive list is empty or not an array');
  //     return [];
  //   }

  //   const filterValue = value.toLowerCase();
  //   const executivelistdata = this.executiveList.filter(executive =>
  //     executive?.pseudoName?.toLowerCase().includes(filterValue)
  //   );

  //   console.log('Filtered Executives:', executivelistdata);
  //   return executivelistdata;
  // }
  private filterExecutives(value: string): any[] {
    console.log('Search Input:', value);
  
    if (!this.executiveList || !Array.isArray(this.executiveList)) {
      console.warn('Executive list is empty or not an array');
      return [];
    }
  
    const filterValue = value.toLowerCase();
    return this.executiveList.filter(executive =>
      executive.pseudoName.toLowerCase().includes(filterValue)
    );
  }
  

  // displayExecutiveName = (id: number): string => {
  //   const executive = this.executiveList.find(exec => exec.id === id);
  //   return executive ? executive.pseudoName : '';
  // };
  displayExecutiveName = (id: number): string => {
    const executive = this.executiveList.find(exec => exec.id === id);
    return executive ? executive.pseudoName : '';
  };

  
  displayTeamleadName = (id: number): string => {
    const teamlead = this.managerList.find(teamlead => teamlead.id === id);
    return teamlead ? teamlead.pseudoName : '';
  }
  // onExecutiveSelected(userId: number) {
  //   const selectedExecutive = this.executiveList.find(executive => executive.id === userId);
  //   if (selectedExecutive) {
  //     this.ratingForm.get('ratedTo')?.setValue(selectedExecutive.id); 
  //   }
  // }
  // onExecutiveSelected(userId: number) {
  //   const selectedExecutive = this.executiveList.find(executive => executive.id === userId);
  //   if (selectedExecutive) {
  //     this.ratingForm.get('ratedTo')?.setValue(selectedExecutive.id);
  //   }
  // }
  onExecutiveSelected(userId: number) {
    const selectedExecutive = this.executiveList.find(executive => executive.id === userId);
    if (selectedExecutive) {
      this.ratingForm.get('ratedTo')?.setValue(selectedExecutive.id);
    } else {
      this.ratingForm.get('ratedTo')?.setErrors({ invalidSelection: true });
    }
  }
  

  onTeamLeadSelected(teamLeadId: number) {
    const selectedTeamLead = this.managerList.find(manager => manager.id === teamLeadId);
    if (selectedTeamLead) {
      this.ratingForm.get('teamLead')?.setValue(selectedTeamLead.id);
      this.getExecutiveDropdown(teamLeadId);
      this.ratingForm.get('ratedTo')!.enable();
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }
  onSubmit(): void {
    if (this.ratingForm.invalid) {
      this.ratingForm.markAllAsTouched();
      console.log('updateee',this.ratingForm.value);
      
      return;
    }
  
    this.isFormSubmitted = true;
    const userIdFromLocalStorage = localStorage.getItem('userid');
    const userRole = localStorage.getItem('role');
    const updatedBy = userIdFromLocalStorage ? Number(userIdFromLocalStorage) : null;
  
    const isManager = userRole === 'Sales Manager' || userRole === 'Recruiting Manager';
    const isTeamLead = userRole === 'Team Leader Sales' || userRole === 'Team Leader Recruiting';
  
    const payload: any = {
      ...this.ratingForm.getRawValue(),
      rating: Number(this.ratingForm.get('rating')?.value),
      ratedBy: Number(this.ratingForm.get('ratedBy')?.value),
      manager: isManager ? Number(userIdFromLocalStorage) : isTeamLead ? null : Number(this.ratingForm.get('manager')?.value),
      ratedTo: this.ratingForm.get('ratedTo')?.value ? Number(this.ratingForm.get('ratedTo')?.value) : null, // Convert empty value to null

    };
  
    if (isTeamLead) {
      payload.teamLead = Number(userIdFromLocalStorage);
    }
  
    if (this.ratingForm.get('id')?.value) {
      payload.updatedBy = updatedBy;
    }
  
    console.log('Payload before sending:', payload);
  
    this.privilegeServ.addratings(payload).subscribe({
      next: (response: any) => {
        console.log('Ratings Saved:', response);
        this.dialogRef.close({ success: true });
      },
      error: (error: any) => {
        console.error('Error saving ratings:', error);
        this.isFormSubmitted = false;
      }
    });
  }
  
  
  
  





}
