import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { SearchPipe } from "src/app/pipes/search.pipe";
import { MatTableModule } from "@angular/material/table";
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";
import { TechsupportService } from "src/app/usit/services/techsupport.service";
import { NgxGpAutocompleteModule } from "@angular-magic/ngx-gp-autocomplete";
import { ISnackBarData, SnackBarService } from "src/app/services/snack-bar.service";
import { Subject, takeUntil } from "rxjs";
import { AddTechnologyTagComponent } from "../../technology-tag-list/add-technology-tag/add-technology-tag.component";
import { DialogService } from "src/app/services/dialog.service";
import { Loader } from "@googlemaps/js-api-loader";
import { Techsupport } from "src/app/usit/models/TechSupport";
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';

@Component({
  selector: "app-add-tech-support",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatCardModule,
    NgxGpAutocompleteModule,
    NgxMatIntlTelInputComponent
  ],
  providers: [
    {
      provide: Loader,
      useValue: new Loader({
        apiKey: 'AIzaSyCT0z0QHwdq202psuLbL99GGd-QZMTm278',
        libraries: ['places'],
      }),
    },
  ],
  templateUrl: "./add-tech-support.component.html",
  styleUrls: ["./add-tech-support.component.scss"],
})
export class AddTechSupportComponent implements OnInit {
  private dialogServ = inject(DialogService);
  onAddTechnology() {
    const dataToBeSentToDailog = {
      title: 'Add Tech-Support',
      buttonCancelText: 'Cancel',
      buttonSubmitText: 'Submit',
      actionData: this.techdata,
      actionName: 'add-tech-support'
    };
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw';
    dialogConfig.data = dataToBeSentToDailog;
    const dialogRef = this.dialogServ.openDialogWithComponent(AddTechnologyTagComponent, dialogConfig)
    dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.allowAction) {
        this.gettech()
      }
    })
  }
  options: any;
  selectData: never[] | undefined;
  isAllOptionsSelected: any;
  isRadSelected!: boolean;
  private snackBarServ = inject(SnackBarService);
  employeedata: any;
  goToTechnologyList() {
    throw new Error("Method not implemented.");
  }
  data = inject(MAT_DIALOG_DATA);
  registerForm: any = FormGroup;
  dialogRef = inject(MatDialogRef<AddTechSupportComponent>);
  submitted: boolean = false;
  techdata: any;
  techArr: any = []
  message!: string;
  id: any;
  entity = new Techsupport();
  constructor(
    private service: TechsupportService,
    private formBuilder: FormBuilder,
  ) { }

  onCancel() {
    this.dialogRef.close();
  }
  gettechsupportByid() {
    this.service.getTechsupportById(this.data.consultantData.id).subscribe(
      (response: any) => {
        this.techArr = response.data;
        this.techArr.map((x: any) => x.selected = false);
      }
    )
  }

  ngOnInit(): void {
    this.gettech();
    if (this.data.actionName === "edit-tech-support") {
      this.initializeRequirementForm(new Techsupport());
      this.service.getTechsupportId(this.data.consultantData.id).subscribe(
        (response: any) => {
          this.entity = response.data;
          this.initializeRequirementForm(response.data);
        }
      )
    } else {
      this.initializeRequirementForm(null);
    }

    this.service.gettechnicalskills().subscribe((response: any) => {
      this.techdata = response;
    });
  }
  private initializeRequirementForm(requirementData: any) {
    this.registerForm = this.formBuilder.group({
      name: [requirementData ? requirementData.name : '',[ Validators.required,this.noInvalidFullName.bind(this)]
],
      // pseudoname: [requirementData ? requirementData.pseudoname : '', Validators.required],
      location: [requirementData ? requirementData.location : '', Validators.required, this.registerForm.location],
      email: [
        requirementData ? requirementData.email : '',
        [  Validators.required,
          Validators.email,
    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
        ],
      ],
      mobile: [requirementData ? requirementData.mobile : '', Validators.required],
      // secmobile: [requirementData ? requirementData.secmobile : '', Validators.required],
      experience: [requirementData ? requirementData.experience : '', [Validators.required, Validators.pattern("^[0-9]*$")]],
      technology: [requirementData ? requirementData.technology : '', Validators.required],
      skills: [requirementData ? requirementData.skills : '', Validators.required],
      id: [requirementData ? requirementData.id : '', this.registerForm.id],
    });
    if (this.data.actionName === 'edit-requirement') {
      this.registerForm.addControl('status', this.formBuilder.control(requirementData ? requirementData.status : ''));
    }
  }
noInvalidFullName(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';

  // Trim and check only whitespace
  if (value.trim() === '') {
    return { whitespace: true };
  }

  // Reject if it contains only digits or only special characters
  const onlyDigits = /^[0-9]+$/.test(value);
  const onlySpecial = /^[^A-Za-z0-9]+$/.test(value);

  if (onlyDigits || onlySpecial) {
    return { invalidChars: true };
  }

  return null; // Valid
}

  private destroyed$ = new Subject<void>();
  getSaveData() {
    this.trimSpacesFromFormValues();
    if (this.data.actionName === 'edit-requirement') {
      return { ...this.entity, ...this.registerForm.value }
    }
    return this.registerForm.value;
  }
  onSubmit() {
    this.message = "";
    this.submitted = true;
    const dataToBeSentToSnackBar: ISnackBarData = {
      message: '',
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      direction: 'above',
      panelClass: ['custom-snack-success'],
    };
    if (this.registerForm.invalid) {
      // Display form errors and mark all controls as touched
      this.displayFormErrors();
      this.isRadSelected = true;
      this.registerForm.markAllAsTouched();
      return;
    }

    const consultantId = this.data?.consultantData?.id;
    if (consultantId) {
      this.registerForm.get('id')!.setValue(consultantId);
    }
    const saveReqObj = this.getSaveData();
    this.service
      .addORUpdateH1bImmigrant(saveReqObj, this.data.actionName)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            dataToBeSentToSnackBar.message =
              this.data.actionName === 'add-tech-support'
                ? 'Tech Support added successfully'
                : 'Tech Support updated successfully';
            this.dialogRef.close();
          } else {
            dataToBeSentToSnackBar.message = resp.message ? resp.message : 'Tech Support already Exists';
            dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          }
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
        error: (err: any) => {
          dataToBeSentToSnackBar.message =
            this.data.actionName === 'add-requirement'
              ? 'Tech Support addition is failed'
              : 'Tech Support updation is failed';
          dataToBeSentToSnackBar.panelClass = ['custom-snack-failure'];
          this.snackBarServ.openSnackBarFromComponent(dataToBeSentToSnackBar);
        },
      });
  }

  trimSpacesFromFormValues() {
    Object.keys(this.registerForm.controls).forEach((controlName: string) => {
      const control = this.registerForm.get(controlName);
      if (control.value && typeof control.value === 'string') {
        control.setValue(control.value.trim());
      }
    });
  }
  displayFormErrors() {
    Object.keys(this.registerForm.controls).forEach((field) => {
      const control = this.registerForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }

  camelCase(event: any) {
    const inputValue = event.target.value;
    event.target.value = this.capitalizeFirstLetter(inputValue);
  }
  capitalizeFirstLetter(input: string): string {
    return input.toLowerCase().replace(/(?:^|\s)\S/g, function (char) {
      return char.toUpperCase();
    });
  }

  convertToLowerCase(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.toLowerCase();
  }
  gettech() {
    this.service.gettechnicalskills().subscribe((response: any) => {
      this.techdata = response;
    });
  }
  skilldata: any;

  techSkills(event: any) {
    const newVal = event.value;
    this.service.getTechsupportById(newVal).subscribe((response: any) => {
      this.registerForm.get('skills').setValue(response.data);
    })
  }
  address = '';
  handleAddressChange(address: any) {
    // this.address = address.formatted_address;
    this.registerForm.get('location').setValue(address.formatted_address);
  }
}
