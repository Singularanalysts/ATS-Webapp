import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OpenreqService } from 'src/app/usit/services/openreq.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RequirementService } from 'src/app/usit/services/requirement.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
interface Recruiter {
  recruitername: any;
  recruiteremail: any;
}
@Component({
  selector: 'app-job-description',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './job-description.component.html',
  styleUrls: ['./job-description.component.scss']
})
export class JobDescriptionComponent implements OnInit {
  private requirementServ = inject(RequirementService);

  dataSource: any;
  private openReqServ = inject(OpenreqService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<JobDescriptionComponent>);
  jobDescriptionWithLineBreaks: any;

  ngOnInit(): void {

    if (this.data.jobType === 'fulltime') {
      this.getFulltimeReqInfo();
    } else {
      this.getReqInfo()

    }
  }
  
jobTitle: string = ''; // class-level variable
jobDescription: string = '';

getReqInfo() {
  this.openReqServ.getOpenReqsById(this.data.id).subscribe(
    (resp: any) => {
      if (resp.status === 'success') {
        if (resp.data) {
          this.dataSource = resp.data;
          this.jobTitle = resp.data.job_title || 'Requirement'; // ✅ store it here
      this.jobDescription = resp.data.job_description|| ''; // ✅ store description
      


          if (resp.data.job_description) {
            this.jobDescriptionWithLineBreaks = resp.data.job_description.replace(/\n/g, '<br>');
          }
        }
      }
    }
  );
}
  recruiters: Recruiter[] = [{ recruitername: '', recruiteremail: '' }];

openEmailClient() {
  const toEmail = localStorage.getItem('UserProfileEmail') || '';

  if (!toEmail) {
    console.error('No recipient email found in local storage.');
    return;
  }

  this.requirementServ.getRecruiters(this.data.vendor).subscribe((response: any) => {
    if (response.status === 'success' && response.data) {
      this.recruiters = response.data;

      // Collect BCC emails (non-empty)
      const bccEmails = this.recruiters
        .map((r: any) => r.email?.trim())
        .filter((email: string) => !!email)
        .join(',');

      // Subject
      const subject = `RE: ${this.jobTitle || 'Job Requirement'}`;

      // Description content
      const jobDescText = (this.jobDescription || 'No description available.').replace(/\r?\n/g, '\r\n');
      console.log(jobDescText,'jobDescTextjobDescText')
      const bodyText = `${jobDescText}\r\n\r\nRegards,`;

      // Log description lengths
      console.log('Raw description length:', jobDescText.length);

      const encodedTo = encodeURIComponent(toEmail);
      const encodedSubject = encodeURIComponent(subject);
      const encodedBCC = encodeURIComponent(bccEmails);
      const encodedBody = encodeURIComponent(bodyText);

      console.log('Encoded body length:', encodedBody.length);
 // ✅ Log lengths
      console.log('Raw job description length:', jobDescText.length);
      console.log('Encoded body length:', encodedBody.length);
      // Start building mailto link
      let mailtoLink = `mailto:${encodedTo}?subject=${encodedSubject}`;

      if (bccEmails.length > 0) {
        mailtoLink += `&bcc=${encodedBCC}`;
      }

      // Estimate total length and conditionally include body
      const totalLength = mailtoLink.length + `&body=${encodedBody}`.length;
      console.log('Total mailto link length:', totalLength);

      if (totalLength <= 2000) {
        mailtoLink += `&body=${encodedBody}`;
      } else {
        console.warn('Body omitted due to URL length limit.');
      }

      // Open email client
      window.location.href = mailtoLink;

    } else {
      console.error('Failed to load recruiters');
    }
  });
}


  private snackBarServ = inject(SnackBarService);

copyJobDescription(jobDescElement: HTMLElement) {
  const tempElement = document.createElement('textarea');
  tempElement.style.position = 'fixed';
  tempElement.style.opacity = '0';
  tempElement.value = jobDescElement.innerText.trim(); // Use innerText to get plain text
  document.body.appendChild(tempElement);
  tempElement.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      this.snackBarServ.openSnackBarFromComponent({
        message: 'Job description copied to clipboard!',
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['custom-snack-success'],
      });
    } else {
      throw new Error('Copy command unsuccessful');
    }
  } catch (err) {
    this.snackBarServ.openSnackBarFromComponent({
      message: 'Failed to copy job description.',
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['custom-snack-failure'],
    });
  }

  document.body.removeChild(tempElement);
}



  getFulltimeReqInfo() {
    this.openReqServ.getOpenFulltimeReqsById(this.data.id).subscribe(
      (resp: any) => {
        if (resp.status === 'success') {
          if (resp.data) {
            this.dataSource = resp.data;
            if (resp.data.job_description) {
              this.jobDescriptionWithLineBreaks = resp.data.job_description.replace(/\n/g, '<br>');
            }
          }
        }
      }
    )
  }
}
