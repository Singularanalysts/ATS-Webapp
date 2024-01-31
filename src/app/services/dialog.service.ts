import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ConfirmComponent } from '../dialogs/confirm/confirm.component';
import { IConfirmDialogData } from '../dialogs/models/confirm-dialog-data';
import { ComponentType } from '@angular/cdk/portal';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog:  MatDialog) { }

  openDialogWithComponent(comp: ComponentType<any> , dialogConfig: MatDialogConfig){
    dialogConfig.disableClose = true;
    return this.dialog.open(comp, dialogConfig);

  }
}
