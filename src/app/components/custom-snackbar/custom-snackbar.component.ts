import { Component, Inject , ViewEncapsulation} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA,    MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { ISnackBarData } from 'src/app/services/snack-bar.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-snackbar',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MatIconModule],
  templateUrl: './custom-snackbar.component.html',
  styleUrls: ['./custom-snackbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomSnackbarComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: ISnackBarData,
  private snackBarRef: MatSnackBarRef<CustomSnackbarComponent>) {

   }

   onClose(){
    this.snackBarRef.dismissWithAction();
   }
}
