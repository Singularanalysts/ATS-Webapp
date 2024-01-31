import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../components/custom-snackbar/custom-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private snackBarRef: MatSnackBar) { }

  openSnackBarFromComponent(data: ISnackBarData){
    const snackBarConfig = new MatSnackBarConfig();

    snackBarConfig.data = data;
    snackBarConfig.duration = data.duration;
    snackBarConfig.direction = data.direction;
    snackBarConfig.verticalPosition = data.verticalPosition;
    snackBarConfig.horizontalPosition = data.horizontalPosition;
    snackBarConfig.panelClass = data.panelClass
    this.snackBarRef.openFromComponent(CustomSnackbarComponent,snackBarConfig);
  }
}

export interface ISnackBarData {
  message: string;
  actionText?: string;
  duration: number;
  direction?: any;
  horizontalPosition?: any;
  verticalPosition?: any;
  panelClass: string[]
}
