import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';
import { CATEGORY } from 'src/app/constants/category';
import { DEPARTMENT } from 'src/app/constants/department';
import { transform } from 'src/app/functions/timer';
import { DialogService } from 'src/app/services/dialog.service';
import {
  ISnackBarData,
  SnackBarService,
} from 'src/app/services/snack-bar.service';
import { Option, QuestionGroup } from 'src/app/usit/models/questionnnaire';
import { QuizService } from 'src/app/usit/services/quiz.service';
const TIMEOUT_VALUE = 60;
@Component({
  selector: 'app-attempt-quiz',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './attempt-quiz.component.html',
  styleUrls: ['./attempt-quiz.component.scss'],
})
export class AttemptQuizComponent implements OnInit, OnDestroy {
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
  formObj!: QuestionGroup;
  // services
  private dialogServ = inject(DialogService);
  private snackBarServ = inject(SnackBarService);
  private fb = inject(FormBuilder);
  private quizServ = inject(QuizService);
  selectedDepartment: any;
  selectedCategory: any;
  clock: string = '';
  interval!: any;
  // to clear subscriptions
  private destroyed$ = new Subject<void>();
  timeLeft: number = 0;
  // services
  ngOnInit(): void {
    // this.getQuestionnaire();
    this.initForm('');
  }

  onSelect(event: MatSelectChange, type: 'dept' | 'cat') {
    if (type === 'dept') {
      this.selectedDepartment = event.value;
    }
    if (type === 'cat') {
      this.selectedCategory = event.value;
    }

    if (this.selectedDepartment && this.selectedCategory) {
      this.getQuestionnaire();
    }
  }
  /**
   * fetch questionnaire
   */
  getQuestionnaire() {
    this.initForm('');
    this.quizServ
      .getQuestionnaire(this.selectedDepartment, this.selectedCategory)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status === 'success') {
            if (resp.data) {
              this.formObj = resp.data;
              this.initForm(this.formObj.options);
              this.onTimeout();
            } else {
              this.dataTobeSentToSnackBarService.message =
                'No Questions Available under the selected category and department, Please select valid data';
              this.dataTobeSentToSnackBarService.panelClass = [
                'custom-snack-failure',
              ];
              this.snackBarServ.openSnackBarFromComponent(
                this.dataTobeSentToSnackBarService
              );
              this.initForm('');
            }
          }
        },
        error: (err) => {
          this.dataTobeSentToSnackBarService.message = 'Internal server error';
          this.dataTobeSentToSnackBarService.panelClass = [
            'custom-snack-failure',
          ];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        },
      });
  }

  /**
   * initialize form
   */
  initForm(data: any) {
    this.quizForm = this.fb.group({
      department: [this.selectedDepartment, [Validators.required]],
      category: [this.selectedCategory, [Validators.required]],
      options: this.fb.array(data ? this.initFormArrayElements(data) : []),
    });
  }
  /**
   *
   * @returns form array controls
   */
  private initFormArrayElements(data: Option[]): FormGroup<any>[] {
    return data.map((control: any) =>
      // this.fb.group({
      //   optionA: [control.optionA, [Validators.required]],
      //   optionB: [control.optionB, [Validators.required]],
      //   optionC: [control.optionC, [Validators.required]],
      //   optionD: [control.optionD, [Validators.required]],
      //   question: [control.question],
      //   answer: [control.answer],
      //   userans: [control.userans]
      // })

      this.fb.group({
        optionA: [control.optionA, [Validators.required]],
        optionB: [control.optionB, [Validators.required]],
        optionC: [control.optionC, [Validators.required]],
        optionD: [control.optionD, [Validators.required]],
        question: [control.question],
        answer: [control.answer],
        userans: [''],
        id: [control.id],
      })
    );
  }

  /**
   *
   * @param event selected answer
   * @param questId question index
   */
  selectAnswer(event: MatRadioChange, questId: number) {
    if (event) {
      const formArr = this.quizForm.controls.options;
      const userAnsControl = formArr.controls[questId]?.get('userans');
      // const answerControl = formArr.controls[questId]?.get('answer');
      // answerControl?.patchValue(event.value);
      userAnsControl?.patchValue(event.value);
    }
  }

  onTimeout() {
    this.timeLeft = TIMEOUT_VALUE;
    this.interval = setInterval(() => {
      if (this.timeLeft === 0) {
        this.pauseTimer();
      } else {
        this.timeLeft--;
      }
      this.clock = transform(this.timeLeft);
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
    this.onSubmit();
  }
  /**
   *
   * submit form
   */
  onSubmit() {
    console.log('form.value for save:', JSON.stringify(this.quizForm.value));
    if (this.quizForm.invalid) {
      // show errors
      this.displayFormErrors();
      return;
    }
    const saveObj = {
      ...this.quizForm.value,
      userid: localStorage.getItem('userid'),
      qid: this.formObj.qid,
    };
    this.quizServ
      .attemptQuiz(saveObj)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp: any) => {
          if (resp.status == 'success') {
            this.dataTobeSentToSnackBarService.panelClass = [
              'custom-snack-success',
            ];
            this.dataTobeSentToSnackBarService.message =
              'Quiz submitted successfully';
            clearInterval(this.interval);
            this.timeLeft = 0;
          } else {
            this.dataTobeSentToSnackBarService.message =
              'Quiz submission failed';
            this.dataTobeSentToSnackBarService.panelClass = [
              'custom-snack-failure',
            ];
          }
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        },
        error: (err: any) => {
          console.log(err.message);
          this.dataTobeSentToSnackBarService.message = err.message;
          this.dataTobeSentToSnackBarService.panelClass = [
            'custom-snack-failure',
          ];
          this.snackBarServ.openSnackBarFromComponent(
            this.dataTobeSentToSnackBarService
          );
        },
      });
  }

  /** to display form validation messages */
  displayFormErrors() {
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
  }

  /**
   * cancels data entered
   */
  onCancel() {
    this.quizForm.reset();
    this.selectedCategory = this.selectedDepartment = '';
    clearInterval(this.interval);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);

    this.destroyed$.next(undefined);
    this.destroyed$.complete();
  }
}
