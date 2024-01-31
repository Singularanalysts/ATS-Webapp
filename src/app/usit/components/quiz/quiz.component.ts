import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { QuizService } from '../../services/quiz.service';
import { ISnackBarData, SnackBarService } from 'src/app/services/snack-bar.service';
import { DialogService } from 'src/app/services/dialog.service';
import { DEPARTMENT } from 'src/app/constants/department';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CATEGORY } from 'src/app/constants/category';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

export interface Questionnaire {
  optionA: FormControl<string | null>;
  optionB: FormControl<string | null>;
  optionC: FormControl<string | null>;
  optionD: FormControl<string | null>;
  question: FormControl<string | null>;
  answer: FormControl<string | null>;
  userans?:FormControl<string | null>;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule,MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule, MatButtonModule, MatTooltipModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit,OnDestroy{ // add quiz component
  objectK = Object;
  deptOptions = DEPARTMENT;
  categoryOptions = CATEGORY;
  // snack bar data
  dataTobeSentToSnackBarService: ISnackBarData = {
    message: '',
    duration: 2500,
    verticalPosition: 'top',
    horizontalPosition: 'center',
    direction: 'above',
    panelClass: ['custom-snack-success'],
  };
  quizForm: any = FormGroup;
  formObj = [
    {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      answer: '',
      id: 1,
    },
  ];
  isFormSubmitted = false;
    // services
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private fb = inject(FormBuilder)
  private quizServ = inject(QuizService);
  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<QuizComponent>);
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  selectedDepartment: any;
  selectedCategory: any;
  setTimeOutVal: any;
  allowAdd = false;
  ngOnInit(): void {
    if(this.data.actionName === 'edit-quiz'){
      this.initForm('');
      this.getQuestionnaireById(this.data.quizData.qid);
    }
   else{
    this.initForm();
   // this.getQuestionnaire();
   }

  }

  onSelect(event: MatSelectChange, type: 'dept'| 'cat'){

    if(type === "dept"){
      this.selectedDepartment = event.value;
    }
    if(type === "cat"){
      this.selectedCategory = event.value;
    }

    if(this.selectedDepartment && this.selectedCategory){
      this.getQuestionnaire();
    }
  }

   /**
   * fetch questionnaire
   */
   getQuestionnaireById(id: number){

    this.quizServ.getQuizById(id).pipe(takeUntil(this.destroyed$)).subscribe({
      next: (resp: any) => {
        if(resp.data){
          this.formObj = resp.data;
          this.allowAdd =  resp.data.options.every((quest: any) => quest.answer !== '');
          this.initForm(this.formObj);
        }
      }
    });
  }
  /**
   * fetch questionnaire
   */
  getQuestionnaire(){
    const department = this.selectedDepartment;
    const category = this.selectedCategory;
    this.quizServ.getQuestionnaire(department,category).pipe(takeUntil(this.destroyed$)).subscribe({
      next: (resp: any) => {
        if (resp.status === "success") {
          if(resp.data){
            this.dataTobeSentToSnackBarService.message = "KPT already exists, Please update KPT with the same selection criteria from KPT list";
            this.dataTobeSentToSnackBarService.panelClass = ["custom-snack-info"];
            this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
            this.dialogRef.close();
          }

        }
      }
    });
  }

  /**
   * initialize form
   */
  initForm(data?: any) {
    this.quizForm = this.fb.group({
      department: [ data ?  data.department : '', [ Validators.required]],
      category: [data ? data.category : '',[Validators.required] ],
      options: this.fb.array(this.initFormArrayElements(data)),
    });
    this.allowAdd =  this.quizForm.controls.options.controls.every((ctrl: FormGroup) => ctrl.get('answer')?.value !== '');

  }

  /**
   *
   * @returns form array controls
   */
  private initFormArrayElements(data?: any): FormGroup<Questionnaire>[] {
    let response = data ? data.options : this.formObj;

    return this.data.actionName === 'add-quiz' ? response.map((control: any) =>
      this.fb.group({
        optionA: [control.optionA,[ Validators.required,Validators.maxLength(100)] ],
        optionB: [control.optionB,[ Validators.required,Validators.maxLength(100)] ],
        optionC: [control.optionC, [Validators.required,Validators.maxLength(100)] ],
        optionD: [control.optionD, [Validators.required,Validators.maxLength(100)] ],
        question: [control.question, [Validators.required,Validators.maxLength(200)] ],
        answer: [control.answer]
      })
    ) : response.map((control: any) =>
    this.fb.group({
      optionA: [control.optionA,[ Validators.required,Validators.maxLength(100)] ],
      optionB: [control.optionB,[ Validators.required,Validators.maxLength(100)] ],
      optionC: [control.optionC, [Validators.required,Validators.maxLength(100)] ],
      optionD: [control.optionD, [Validators.required,Validators.maxLength(100)] ],
      question: [control.question, [Validators.required,Validators.maxLength(200)] ],
      answer: [control.answer],
      id:[control.id]
    })
  );
  }

  /**
   *
   * @param event selected answer
   * @param questId question index
   */
  selectAnswer(event: MatRadioChange, questId: number) {
    if(event){
      const formArr = this.quizForm.controls.options;
      const control = formArr.controls[questId]?.get('answer');
      control?.patchValue(event.value);
    }

  }

  /**
   * To Question dynamically
   */
  addQuestion() {
    const controls = {
      optionA: ['', [Validators.required, Validators.maxLength(100)]],
      optionB: ['', [Validators.required, Validators.maxLength(100)]],
      optionC: ['', [Validators.required, Validators.maxLength(100)]],
      optionD: ['',[Validators.required, Validators.maxLength(100)]],
      question: ['',[ Validators.required, Validators.maxLength(200)]],
      answer: [''],
      //id: [this.formObj.length+1]
    };

    this.quizForm.controls.options.push(this.fb.group(controls))
  }

  /**
   * removes question
   * @param id question id
   */
  removeQuestion(id: number) {
    this.quizForm.controls.options.removeAt(id);
  }

  /**
   *
   * submit form
   */
  onSubmit() {
    this.isFormSubmitted = true;
    console.log('form.value for save:', JSON.stringify(this.quizForm.value));
    if (this.quizForm.invalid) {
      // show errors
      this.displayFormErrors();
      return;
    }
    const saveObj = this.data.actionName ===  'add-quiz' ? this.quizForm.value : {...this.quizForm.value, qid: this.data.quizData.qid}
    this.quizServ.addOrEdit(saveObj, this.data.actionName).pipe(takeUntil(this.destroyed$)).subscribe({
      next:(resp: any) => {

        if (resp.status == 'success') {
          this.dataTobeSentToSnackBarService.message = this.data.actionName ===  'add-quiz' ? 'Quiz added Successfully' : 'Quiz updated Successfully';
        } else {
          this.dataTobeSentToSnackBarService.message =  this.data.actionName ===  'add-quiz' ? 'Quiz addition failed': 'Quiz updation failed';
          this.dataTobeSentToSnackBarService.panelClass = ["custom-snack-failure"];
        }
        this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
        this.dialogRef.close();
      }, error: (err : any) =>{
        console.log(err.message);
        this.dataTobeSentToSnackBarService.message = err.message;
        this.dataTobeSentToSnackBarService.panelClass = ["custom-snack-failure"];
        this.snackBarServ.openSnackBarFromComponent(this.dataTobeSentToSnackBarService);
      }
    })
  }

  /** to display form validation messages form-array's controls*/
  displayFormErrors() {
    //validation for form-array's controls
    this.quizForm.controls.options.controls.forEach((fg: any) => {
      if (fg && fg.invalid) {
        Object.keys(fg.controls).forEach((fgc) => {
          const control = fg.get(fgc);
          if (control && control.invalid) {
            control.markAsTouched();
          }
        });
      }
    });
    /** to display form validation messages for controls other than the form-array's controls*/
    Object.keys(this.quizForm.controls).forEach((field) => {
      const control = this.quizForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched();
      }
    });
  }
  /**
   * cancels data entered
   */
  onAction(actionName : string){
    if(actionName === "CANCEL"){
      this.quizForm.reset();
    }
    this.dialogRef.close()
  }

  /**
   * clean up subscriptions
   */
  ngOnDestroy(): void {

      this.destroyed$.next(undefined);
      this.destroyed$.complete();
  }
}
