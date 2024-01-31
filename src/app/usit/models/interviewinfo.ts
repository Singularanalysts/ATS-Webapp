import { Closure } from "./closure";
import { Employee } from "./employee";
import { SubmissionInfo } from "./submissioninfo";

export class InterviewInfo {
    closure = new Closure();
    feedback!: string;
    flg!:string;
    interviewdate!: string;
    interviewno!: string;
    interviewstatus!: string;
    intrid!: number;
    mode!: string;
    recmaxno!: string;
    round!: string;
    salesmaxno!: string;
    submission!: number;
    timezone!: string;
    updatedby = localStorage.getItem('userid');
    users !: number;
    createddate!:string;
	updateddate!:string;
    status!:string;
}