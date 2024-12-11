import { Component, inject, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgxEditorConfig, NgxEditorModule, Toolbar } from 'ngx-editor';
import { Editor } from 'ngx-editor';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { InvoiceService } from '../../services/invoice.service';
import { ApiService } from 'src/app/core/services/api.service';
import { MatSelectModule } from '@angular/material/select';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';

const editorConfig: NgxEditorConfig = {
  locals: {
    bold: 'Bold',
    italic: 'Italic',
    code: 'Code',
    blockquote: 'Blockquote',
    underline: 'Underline',
    strike: 'Strike',
    bullet_list: 'Bullet List',
    ordered_list: 'Ordered List',
    heading: 'Heading',
    h1: 'Header 1',
    h2: 'Header 2',
    h3: 'Header 3',
    h4: 'Header 4',
    h5: 'Header 5',
    h6: 'Header 6',
    align_left: 'Left Align',
    align_center: 'Center Align',
    align_right: 'Right Align',
    align_justify: 'Justify',
    text_color: 'Text Color',
    background_color: 'Background Color',

    url: 'URL',
    text: 'Text',
    openInNewTab: 'Open in new tab',
    insert: 'Insert',
    altText: 'Alt Text',
    title: 'Title',
    remove: 'Remove',
    enterValidUrl: 'Please enter a valid URL',
  },
};

@Component({
  selector: 'app-composemail',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    NgxEditorModule,
    MatCheckboxModule,
    FileUploadModule,
    MatSelectModule
  ],
  templateUrl: './composemail.component.html',
  styleUrls: ['./composemail.component.scss']
})
export class ComposemailComponent {
  emailForm!: FormGroup;
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  public animation: boolean = false;
  public multiple: boolean = true;
  private filesControl = new FormControl<File[]>([], FileUploadValidators.filesLimit(6));
  private invoiceServ = inject(InvoiceService);
  private snackBarServ = inject(SnackBarService);
  formData: FormData = new FormData();
  invoiceid: any;
  invoicenumber: any;
  ccMailsList: string[] = ['shanpasha@narveetech.com', 'ramya@narveetech.com', 'laxman@narveetech.com',];

  constructor(
    @Inject(MAT_DIALOG_DATA) protected data: any,
    public dialogRef: MatDialogRef<ComposemailComponent>,
    private fb: FormBuilder,
    private apiServ: ApiService
  ) { }

  ngOnInit(): void {
    this.invoiceid = this.data.invoiceData.invoiceId;
    this.invoicenumber = this.data.invoiceData.invoiceNumber;
    this.editor = new Editor();
    this.emailForm = this.fb.group({
      toMail: [this.data.invoiceData ?  this.data.invoiceData.acrmail :'', [Validators.required, Validators.email]],
      subject: ['Invoice Payment Recorded', Validators.required],
      ccMails: [[]],
      body: ['', Validators.required],
      attachAttachments: [false],
      attachments: this.filesControl
    });

    const emailMessage = `
    <div>Dear ${this.data.invoiceData.vendorName},</div><br>
    <div>I hope this message finds you well.</div><br>
    <div>We have prepared the following invoice for you: <strong> # ${ this.data.invoiceData.invoiceNumber } </strong> <div>
    <div>
      <strong>Invoice Status: </strong> ${ this.data.invoiceData!.status}<br>
      You can view the invoice on the following link: <a href="${this.apiServ.apiUrl}billpay/invoice/downloadInvoice/${this.data.invoiceData.invoiceId}" target="_blank">${this.data.invoiceData.invoiceNumber}</a></li>
    </div><br>
    <div>If you have any questions or need further assistance, please do not hesitate to reach out to us.</div>
    <div>Thank you for your attention to this matter.</div><br>
    <div>
      <strong>Kind Regards, </strong><br>
      Accounts Team, <br>
      Narvee Tech Inc, <br>
      1333 Corporate Dr, Suite#102, <br>
      Irving, Texas, 75038.<br>
      Email: accounts@narveetech.com<br>
      Phone: +1(469) 300 - 6363<br>
      Website: https://www.narveetech.com
    </div>
    `;

    this.emailForm.get('body')!.setValue(emailMessage);
  }

  onSubmit(): void {


    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };  
    
    if (this.emailForm.valid) {
      const formValues = this.emailForm.value;
      this.formData = new FormData();

      this.formData.append('toMail', formValues.toMail || '');
      this.formData.append('subject', formValues.subject || '');
      this.formData.append('body', formValues.body || '');
      this.formData.append('attachAttachments', String(formValues.attachAttachments || false));
      this.formData.append('invoiceId', this.invoiceid || '');
      this.formData.append('invoiceNumber', this.invoicenumber || '');
      this.formData.append('ccMails', formValues.ccMails || '');

      const attachments = formValues.attachments;
      if (attachments && attachments.length > 0) {
        for (let i = 0; i < attachments.length; i++) {
          this.formData.append(`attachments`, attachments[i]);
        }
      } else {
        console.warn('No attachments found.');
      }
      
      this.invoiceServ.sendEmail(this.formData).subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message ="Email sent successfully"
                this.dialogRef.close();
          } else{

            dataToBeSentToSnackBar.message ="Email sent failed"
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
          
        },
        error: (err: any) => {
          console.error('Error from API:', err);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
