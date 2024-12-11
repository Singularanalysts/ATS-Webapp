  import { Component, OnInit, inject } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { RequirementService } from 'src/app/usit/services/requirement.service';
  import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
  import { MatButtonModule } from '@angular/material/button';
  import { MatIconModule } from '@angular/material/icon';
  import { MatCardModule } from '@angular/material/card';

  @Component({
    selector: 'app-purchase-order-info',
    templateUrl: './purchase-order-info.component.html',
    styleUrls: ['./purchase-order-info.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      MatCardModule,
      MatIconModule,
      MatButtonModule,
      MatIconModule
    ]
  })
  export class PurchaseOrderInfoComponent {

    dataSource: any;
     data = inject(MAT_DIALOG_DATA);
    dialogRef = inject(MatDialogRef<PurchaseOrderInfoComponent>);

    ngOnInit(): void {

      this.dataSource=this.data.info
    }

  
  }



