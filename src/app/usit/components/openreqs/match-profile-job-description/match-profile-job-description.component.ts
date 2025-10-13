import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { debounceTime, map, startWith, tap } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-match-profile-job-description',
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
    MatChipsModule
  ],
  templateUrl: './match-profile-job-description.component.html',
  styleUrls: ['./match-profile-job-description.component.scss']
})
export class MatchProfileJobDescriptionComponent implements OnInit {

  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<MatchProfileJobDescriptionComponent>);
  private openServ = inject(OpenreqService);

  searchControl = new FormControl('');
  consultantData: any[] = [];
  filteredConsultants: any[] = [];
  consultantOptions: any[] = [];
  searchConsultantOptions$!: Observable<any>;

  ngOnInit(): void {
      const userId = localStorage.getItem('userid');

    this.searchConsultantOptions$ = this.openServ.getHotlist(userId).pipe(map((x: any) => x.data), tap(resp => {
      if (resp && resp.length) {
        this.getConsultantOptionsForAutoComplete(resp);
      }
    }));
  }

  getConsultantOptionsForAutoComplete(data: any) {
    this.consultantOptions = data;
    this.searchConsultantOptions$ =
      this.searchControl.valueChanges.pipe(
        startWith(''),
        map((value: any) =>
          this.filterConsultants({ consultantname: value } || '', this.consultantOptions)
        )
      );
  }

  filterConsultants(value: any, options: any): string[] {
    const filterValue = value.consultantname.toLowerCase();
    const filteredData = options.filter((option: any) =>
      option.consultantname.toLowerCase().includes(filterValue)
    );
    return filteredData;
  }

  onSubmit() {
    const selectedValue = this.searchControl.value;
    const selectedOption = this.consultantOptions.find(option => option.consultantname === selectedValue);
    
    if (selectedOption) {
      const selectedConsultantId = selectedOption.consultantid;
      this.matchResume(selectedConsultantId);
    } 
  }

 matchResume(id: number) {
  this.openServ.matchResume(id, this.data.jobData.job_description).subscribe({
    next: (res: any) => {
      console.log(res)
    }
  })
 }
}
