import { Injectable, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { Questionnaire } from '../components/quiz/quiz.component';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiServ = inject(ApiService);

  // get questionnaire
  getQuestionnaire(department: string, category: string){
    return this.apiServ.get(`kpt/getTest/${department}/${category}`)
  }

  // get all quizes
  getAllQuizes(){
    return this.apiServ.get(`kpt/getTests/`);
  }


  //register questionnaire
  saveQuestionnaire(entity: any) {
    return this.apiServ.post("kpt/save", entity);
  }

  // write quiz
  attemptQuiz(entity: any) {
    return this.apiServ.post("kpt/writeTest", entity);
  }
  // get quiz by id

  getQuizById(quizId: number){
    return this.apiServ.get(`kpt/getbyid/${quizId}`);
  }

  // delete quiz
  deleteQuiz(quizId: number) {
    return this.apiServ.delete(`kpt/deleteQuiz/${quizId}`);
  }

  // get all quiz
  getAllQuiz(){
    return this.apiServ.get('kpt/all')
  }

  // update quiz
  updateQuiz(entity: any){
    return this.apiServ.put("kpt/update", entity);
  }

  // add - edit
  addOrEdit(entity: any, actionName: 'edit-quiz' | 'add-quiz'){
    return actionName === 'edit-quiz' ? this.updateQuiz(entity) : this.saveQuestionnaire(entity)
  }

  // quiz result
  getQuizResults(){
    return this.apiServ.get('kpt/testResult')
  }


}
