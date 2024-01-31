import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultantService } from 'src/app/usit/services/consultant.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { AddconsultantComponent } from '../add-consultant/add-consultant.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-consultant-track',
  standalone: true,
  imports: [  MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,

    MatFormFieldModule,
    MatSortModule,

    CommonModule,
    MatTooltipModule,],
  templateUrl: './consultant-track.component.html',
  styleUrls: ['./consultant-track.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConsultantTrackComponent implements OnInit, OnDestroy{
 // pagination code
 dataTableColumns: string[] = [
  'Date',
  'Status',
  'Remarks',
  'UpdatedBy',
  'UpdatedDate',

];
dataSource = new MatTableDataSource<any>([]);
  private consultantServ  = inject(ConsultantService);
  private snackBarServ = inject(SnackBarService);
  private router = inject(Router);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ConsultantTrackComponent>);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  consultant_track: any[] = [];


  ngOnInit(): void {
    this.consultantServ
    .consultantTracker(this.data.consultantData.consultantid)
    .subscribe((response: any) => {
      this.consultant_track = response.data;
      if(response.data){
        this.dataSource.data = response.data;
      }
    });
}

onClose(){
  this.dialogRef.close()
}

  ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete()
  }
}
