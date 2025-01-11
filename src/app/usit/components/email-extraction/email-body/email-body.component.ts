import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequirementService } from 'src/app/usit/services/requirement.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { OpenreqService } from 'src/app/usit/services/openreq.service';

@Component({
  selector: 'app-email-body',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './email-body.component.html',
  styleUrls: ['./email-body.component.scss']
})

export class EmailBodyComponent implements OnInit {
  private openServ = inject(OpenreqService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<EmailBodyComponent>);
  body!: SafeHtml;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.showTheBody(this.data.data.id)
  }

  showTheBody(id: any) {
    this.openServ.showBody(id).subscribe({
      next: (response: any) => {
        this.body = this.sanitizer.bypassSecurityTrustHtml(response.data);
      },
      error: (err: any) => {
        console.error('Error occurred:', err);
      }
    });
  }

}
