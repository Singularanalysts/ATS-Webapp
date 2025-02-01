import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TimeSheetService } from 'src/app/usit/services/time-sheet.service';

@Component({
  selector: 'app-timesheet-attachments',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './timesheet-attachments.component.html',
  styleUrls: ['./timesheet-attachments.component.scss']
})

export class TimesheetAttachmentsComponent {

  private tagServ = inject(TimeSheetService);

  attachments: any[] = [];

  constructor(public dialogRef: MatDialogRef<TimesheetAttachmentsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.attachments = data.attachments || [];

  }

  onAction(action: string) {
    if (action === 'SAFE_CLOSE') {
      this.dialogRef.close();
    }
  }

  viewAttachment(attachment: any) {
    // Logic to view the attachment
    window.open(attachment.url, '_blank');
  }

  deleteAttachment(id: number) {
    // Logic to delete the attachment
    console.log(`Attachment with ID ${id} deleted.`);
  } 

  // downloadAttachment(id: number): void {
  //   this.tagServ.downloadAttachment(id).subscribe({
  //     next: (response: any) => {
  //       if (!response || !response.fileData || !response.attachmentName) {
  //         alert('Invalid attachment data.');
  //         return;
  //       }
  
  //       // Extract file name and extension
  //       const fileName = response.attachmentName;
  //       const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
        
  //       // Determine MIME type based on file extension
  //       const mimeType = this.getMimeType(fileExtension);
  
  //       // Decode Base64 to binary data
  //       const byteCharacters = atob(response.fileData);
  //       const byteNumbers = new Array(byteCharacters.length);
  //       for (let i = 0; i < byteCharacters.length; i++) {
  //         byteNumbers[i] = byteCharacters.charCodeAt(i);
  //       }
  //       const byteArray = new Uint8Array(byteNumbers);
  
  //       // Create a Blob with the detected MIME type
  //       const blob = new Blob([byteArray], { type: mimeType });
  
  //       // Create a URL for the Blob
  //       const url = window.URL.createObjectURL(blob);
  
  //       // Create a link element for downloading
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.download = fileName;
  
  //       // Trigger download
  //       document.body.appendChild(link);
  //       link.click();
  
  //       // Clean up
  //       document.body.removeChild(link);
  //       window.URL.revokeObjectURL(url);
  //     },
  //     error: (error: any) => {
  //       console.error('Error downloading attachment:', error);
  //       alert('Failed to download the attachment. Please try again later.');
  //     }
  //   });
  // }
  
  downloadAttachment(id: number): void {
    this.tagServ.downloadAttachment(id).subscribe({
      next: (response: any) => {
        if (!response || !response.fileData || !response.attachmentName) {
          return;
        }
  
        // Extract file name and extension
        const fileName = response.attachmentName;
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
  
        // Determine MIME type based on file extension
        const mimeType = this.getMimeType(fileExtension);
  
        // Decode Base64 to binary data
        const byteCharacters = atob(response.fileData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
  
        // Create a Blob with the detected MIME type
        const blob = new Blob([byteArray], { type: mimeType });
  
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);
  
        // Check if the file should be opened in a new tab
        if (['pdf', 'png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
          window.open(url, '_blank');
        } else {
          // Create a link element for downloading
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
  
          // Trigger download
          document.body.appendChild(link);
          link.click();
  
          // Clean up
          document.body.removeChild(link);
        }
  
        // Revoke object URL to free memory
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Error downloading attachment:', error);
     
      }
    });
  }
  
  getMimeType(extension: string): string {
    const mimeTypes: { [key: string]: string } = {
      'pdf': 'application/pdf',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'txt': 'text/plain',
      'csv': 'text/csv',
      'zip': 'application/zip',
      'rar': 'application/vnd.rar',
      '7z': 'application/x-7z-compressed',
      'mp3': 'audio/mpeg',
      'mp4': 'video/mp4',
      'wav': 'audio/wav',
      'avi': 'video/x-msvideo',
      'mov': 'video/quicktime'
    };
    
    return mimeTypes[extension] || 'application/octet-stream'; // Default to binary if unknown
  }

  

  getAttachmentNameById(id: number): string | undefined {
    const attachment = this.attachments.find(att => att.id === id);
    return attachment?.attachment_name;
  }
}
